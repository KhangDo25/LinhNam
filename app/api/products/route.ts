import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product.model';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const realm = searchParams.get('realm');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const query: any = {};
    if (realm) query.realm = realm;
    if (category) query.category = category;
    
    const products = await Product.find(query)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length,
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

}