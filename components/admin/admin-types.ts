"use client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  emailVerified: boolean;
  locked: boolean;
  createdAt?: string;
}

export interface AdminOrder {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  userId?: { name?: string; email?: string } | string;
}

export interface InventoryRow {
  productId: string;
  name: string;
  priceValue: number;
  stock: number;
}

export type AdminTab = "overview" | "inventory" | "orders" | "users" | "topup";

export async function adminFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("token");
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
  return data;
}
