import { NextResponse } from 'next/server';
import { shopItems } from '@/data/shop';
import { getShopCatalog } from '@/app/api/products/route';
import { requireAdmin } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import ProductOverride from '@/lib/models/ProductOverride.model';
import { apiLimiter, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const catalog = await getShopCatalog();
    const product = catalog.find((p) => p.id === id);
    if (!product) return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rl = apiLimiter.check(req);
  if (!rl.success) return rateLimitResponse(rl.resetMs);
  const { error } = await requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  if (!shopItems.some((p) => p.id === id)) return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
  const data = (await req.json()) as { priceValue?: number; stock?: number };
  if (data.priceValue !== undefined && (!Number.isFinite(data.priceValue) || data.priceValue < 0 || data.priceValue > 100_000_000)) return NextResponse.json({ error: 'Giá không được âm' }, { status: 400 });
  if (data.stock !== undefined && (!Number.isInteger(data.stock) || data.stock < -1 || data.stock > 1_000_000)) return NextResponse.json({ error: 'Kho không hợp lệ (-1 = vô hạn)' }, { status: 400 });
  await connectDB();
  await ProductOverride.findOneAndUpdate({ productId: id }, { $set: { ...(data.priceValue !== undefined ? { priceValue: Math.floor(data.priceValue) } : {}), ...(data.stock !== undefined ? { stock: data.stock } : {}) } }, { upsert: true, new: true });
  const catalog = await getShopCatalog();
  return NextResponse.json({ success: true, product: catalog.find((p) => p.id === id) });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rl = apiLimiter.check(req);
  if (!rl.success) return rateLimitResponse(rl.resetMs);
  const { error } = await requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  await connectDB();
  await ProductOverride.deleteOne({ productId: id });
  return NextResponse.json({ success: true, message: 'Đã reset sản phẩm về giá gốc' });
}
