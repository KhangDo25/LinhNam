"use client";

import { useEffect, useState } from "react";
import { getOrderHistory, Order } from "@/lib/orderHistory";

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setOrders(getOrderHistory());
  }, []);

  if (!isMounted) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Lịch Sử Mua Hàng</h1>
      
      {orders.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-neutral-800 rounded-lg text-neutral-400">
          Bạn chưa có đơn hàng nào trong lịch sử.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="border border-neutral-800 p-4 rounded-lg bg-neutral-900/50 backdrop-blur"
            >
              <div className="flex justify-between items-center text-sm text-neutral-400 mb-3 border-b border-neutral-800 pb-2">
                <span>Mã đơn: <strong className="text-amber-400">{order.id}</strong></span>
                <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-neutral-200">{item.name} <span className="text-neutral-500">x{item.quantity}</span></span>
                    <span className="text-neutral-300">{(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                ))}
              </div>

              <div className="text-right text-amber-500 font-bold mt-3 pt-2 border-t border-neutral-800">
                Tổng tiền: {order.totalAmount.toLocaleString("vi-VN")} VNĐ
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}