import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order.model';
import User from '@/lib/models/User.model';
import { requireAdmin } from '@/lib/admin-auth';
import ProductOverride from '@/lib/models/ProductOverride.model';
import { shopItems } from '@/data/shop';

// Admin: tổng quan kho + doanh thu
export async function GET(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  await connectDB();
  const [userCount, orderCount, revenueAgg, overrides, recentOrders] = await Promise.all([
    User.countDocuments({}),
    Order.countDocuments({}),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ProductOverride.find({}).lean(),
    Order.find({}).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email').lean(),
  ]);

  const overrideMap = new Map(overrides.map((o) => [o.productId, o]));
  const inventory = shopItems.map((item) => {
    const o = overrideMap.get(item.id) as { priceValue?: number; stock?: number } | undefined;
    return {
      productId: item.id,
      name: item.name,
      priceValue: o?.priceValue ?? item.priceValue,
      stock: o?.stock ?? -1,
    };
  });

  return NextResponse.json({
    success: true,
    stats: {
      users: userCount,
      orders: orderCount,
      revenue: revenueAgg[0]?.total ?? 0,
      products: shopItems.length,
    },
    inventory,
    recentOrders,
  });
}