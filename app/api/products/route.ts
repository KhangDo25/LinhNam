import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { shopItems } from '@/data/shop';
import ProductOverride from '@/lib/models/ProductOverride.model';
import { requireAdmin } from '@/lib/admin-auth';

export type ProductDTO = (typeof shopItems)[number] & {
  stock: number;
  updatedAt?: string;
};

/** Giá + tồn kho thực tế = data/shop.ts gốc + override của admin trong DB. */
export async function getShopCatalog(): Promise<ProductDTO[]> {
  try {
    await connectDB();
    const overrides = await ProductOverride.find({}).lean();
    const map = new Map<string, { priceValue?: number; stock?: number; updatedAt?: Date }>();
    for (const o of overrides as unknown as { productId: string; priceValue?: number; stock?: number; updatedAt?: Date }[]) {
      map.set(o.productId, o);
    }
    return shopItems.map((item) => {
      const o = map.get(item.id);
      const priceValue = o?.priceValue ?? item.priceValue;
      let priceLabel: string;
      if (priceValue === 0) {
        priceLabel = item.priceValue === 0 ? item.price : "Không thể mua";
      } else {
        priceLabel = `${priceValue.toLocaleString("vi-VN")} Linh Thạch`;
      }
      return {
        ...item,
        priceValue,
        price: priceLabel,
        stock: o?.stock ?? -1,
        updatedAt: o?.updatedAt?.toISOString?.(),
      };
    });
  } catch {
    return shopItems.map((item) => ({ ...item, stock: -1 }));
  }
}

// Public: ai cũng xem được catalog (kể cả chưa login)
export async function GET() {
  try {
    const catalog = await getShopCatalog();
    return NextResponse.json({ success: true, products: catalog });
  } catch (error) {
    console.error('Get catalog error:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

// Admin: upsert giá / tồn kho cho 1 sản phẩm trong shop
export async function PUT(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = (await req.json()) as {
    productId?: string;
    priceValue?: number;
    stock?: number;
  };
  if (!body.productId || !shopItems.some((p) => p.id === body.productId)) {
    return NextResponse.json({ error: 'Sản phẩm không tồn tại.' }, { status: 404 });
  }
  if (
    body.priceValue !== undefined &&
    (!Number.isFinite(body.priceValue) || body.priceValue < 0)
  ) {
    return NextResponse.json({ error: 'Giá không hợp lệ.' }, { status: 400 });
  }
  if (
    body.stock !== undefined &&
    (!Number.isInteger(body.stock) || body.stock < -1)
  ) {
    return NextResponse.json({ error: 'Số lượng không hợp lệ (-1 = vô hạn).' }, { status: 400 });
  }

  await connectDB();
  const override = await ProductOverride.findOneAndUpdate(
    { productId: body.productId },
    {
      $set: {
        ...(body.priceValue !== undefined ? { priceValue: Math.floor(body.priceValue) } : {}),
        ...(body.stock !== undefined ? { stock: body.stock } : {}),
      },
    },
    { upsert: true, new: true }
  );

  const catalog = await getShopCatalog();
  return NextResponse.json({
    success: true,
    override: {
      productId: override.productId,
      priceValue: override.priceValue,
      stock: override.stock,
    },
    products: catalog,
  });
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'Thiếu productId.' }, { status: 400 });
  }
  await connectDB();
  await ProductOverride.deleteOne({ productId });
  const catalog = await getShopCatalog();
  return NextResponse.json({ success: true, products: catalog });
}