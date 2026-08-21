export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
}

const STORAGE_KEY = "purchase_history";
export const getOrderHistory = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Lỗi đọc lịch sử mua hàng:", error);
    return [];
  }
};
export const saveOrderToHistory = (items: OrderItem[], totalAmount: number): Order => {
  const currentHistory = getOrderHistory();
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalAmount,
    items,
  };

  const updatedHistory = [newOrder, ...currentHistory];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return newOrder;
};