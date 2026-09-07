import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product.model';
import { verifySession } from '@/lib/auth-session';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const realm = searchParams.get('realm');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (realm) query.realm = realm;
    if (category) query.category = category;
    
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await req.json();
    
    // Validate
    if (!data.name || !data.price || !data.realm) {
      return NextResponse.json(
        { error: 'Thiếu thông tin sản phẩm (name, price, realm)' },
        { status: 400 }
      );
    }

    if (data.price < 0) {
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

    const product = await Product.create({
      name: data.name.trim(),
      description: data.description || '',
      price: data.price,
      images: data.images || [],
      category: data.category || 'Khác',
      stock: data.stock || 0,
      realm: data.realm,
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Tạo sản phẩm thành công',
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra khi tạo sản phẩm' },
      { status: 500 }
    );
  }
}