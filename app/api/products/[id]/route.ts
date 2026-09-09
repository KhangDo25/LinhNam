import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product.model';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verifySession } = await import('@/lib/auth-session');
    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await req.json();

    if (data.price !== undefined && data.price < 0) {
      return NextResponse.json(
        { error: 'Giá sản phẩm không được âm' },
        { status: 400 }
      );
    }

    if (data.stock !== undefined && data.stock < 0) {
      return NextResponse.json(
        { error: 'Số lượng tồn kho không được âm' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verifySession } = await import('@/lib/auth-session');
    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}