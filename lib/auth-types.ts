export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  emailVerified: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid";
  createdAt: string;
}
