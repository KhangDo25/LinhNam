"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, User } from "@/lib/auth-types";
import {
  getLoginLockoutMessage,
  recordFailedLogin,
  clearLoginAttempts,
} from "@/lib/auth-validation";

const CART_KEY = "linh-nam-cart";
const PENDING_VERIFY_KEY = "linh-nam-pending-verify";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "paid";
  createdAt: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  needsVerification?: boolean;
  userId?: string;
}

interface CheckoutResult {
  ok: boolean;
  error?: string;
  orderId?: string;
  items?: CartItem[];
}

interface AuthContextValue {
  user: User | null;
  balance: number;
  cart: CartItem[];
  cartCount: number;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyEmail: (userId: string, code: string) => Promise<AuthResult>;
  resendVerification: (userId: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  addToCart: (productId: string, qty?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (total: number) => Promise<CheckoutResult>;
  topup: (amount: number) => Promise<{ ok: boolean; error?: string; balance?: number; message?: string }>;
  getOrders: () => Order[];
}

const AuthCtx = createContext<AuthContextValue | null>(null);

function parseOrders(value: unknown): Order[] {
  return Array.isArray(value) ? (value as Order[]) : [];
}

async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token');

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err: any = new Error(data.error || `API Error: ${response.status}`);
    err.data = data;
    err.status = response.status;
    throw err;
  }

  return data;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(100_000);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (typeof data.balance === 'number') setBalance(data.balance);
        } else if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('Verify API failed, using cached user:', error);
        if (userData) setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshSession();

      try {
        const storedCart = localStorage.getItem(CART_KEY);
        if (storedCart) {
          const parsed: unknown = JSON.parse(storedCart);
          if (Array.isArray(parsed)) {
            setCart(parsed as CartItem[]);
          }
        }
      } catch {}

      setLoading(false);
    })();
  }, [refreshSession]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, loading]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      try {
        // Timeout phía client 20s — server đã race 12s nên không bao giờ
        // treo quá lâu; tránh UI "Đang xử lý…" vô hạn khi mạng/SMTP kẹt.
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20_000);
        try {
          const data = await apiFetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
            signal: controller.signal,
          });

          if (data.userId) {
            localStorage.setItem(PENDING_VERIFY_KEY, data.userId);
          }

          return {
            ok: true,
            userId: data.user?.id || data.userId,
            needsVerification: true,
          };
        } finally {
          clearTimeout(timer);
        }
      } catch (error: any) {
        console.error('Register error:', error);
        if (error?.name === 'AbortError') {
          return {
            ok: false,
            error: 'Máy chủ phản hồi quá lâu (SMTP timeout). Tài khoản có thể đã được tạo — hãy thử đăng nhập hoặc đăng ký lại.',
          };
        }
        return {
          ok: false,
          error: error.message || 'Đăng ký thất bại. Vui lòng thử lại.',
        };
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const lockMsg = getLoginLockoutMessage();
      if (lockMsg) {
        return { ok: false, error: lockMsg };
      }

      try {
        const data = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        clearLoginAttempts();

        const userData = data.user || {
          id: data.userId,
          email: email,
          name: data.name || 'User',
          createdAt: new Date().toISOString(),
          emailVerified: true,
        };

        setUser(userData);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (typeof data.balance === 'number') setBalance(data.balance);

        return { ok: true };
      } catch (error: any) {
        console.error('Login error:', error);

        recordFailedLogin();

        // API login trả { needsVerification, userId } kèm 403 khi chưa xác thực
        const body = error?.data || {};
        if (body?.needsVerification) {
          return {
            ok: false,
            error: body.error || error.message,
            needsVerification: true,
            userId: body.userId,
          };
        }

        return {
          ok: false,
          error: error.message || 'Email hoặc mật khẩu không đúng.',
        };
      }
    },
    []
  );

  const verifyEmail = useCallback(
    async (userId: string, code: string): Promise<AuthResult> => {
      try {
        const data = await apiFetch('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ userId, code }),
        });

        localStorage.removeItem(PENDING_VERIFY_KEY);
        if (typeof data.balance === 'number') setBalance(data.balance);
        return { ok: true };
      } catch (error: any) {
        console.error('Verify error:', error);
        return {
          ok: false,
          error: error.message || 'Xác thực thất bại. Vui lòng thử lại.',
        };
      }
    },
    []
  );

  const resendVerification = useCallback(
    async (userId: string): Promise<AuthResult> => {
      try {
        await apiFetch('/api/auth/resend-verification', {
          method: 'POST',
          body: JSON.stringify({ userId }),
        });

        return { ok: true };
      } catch (error: any) {
        console.error('Resend error:', error);
        return {
          ok: false,
          error: error.message || 'Không thể gửi lại mã xác thực. Vui lòng thử lại.',
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(PENDING_VERIFY_KEY);
    setUser(null);
  }, []);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { productId, quantity: qty }];
    });
  }, []);

  const updateCartQty = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getOrders = useCallback(() => {
    return orders;
  }, [orders]);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiFetch('/api/orders');
      const list = parseOrders(data.orders).map((o: any) => ({
        id: o._id?.toString?.() || o.id,
        userId: typeof o.userId === 'object' ? o.userId?.toString?.() : (o.userId || ''),
        items: o.items?.map?.((it: any) => ({
          productId: typeof it.productId === 'object' ? it.productId?._id?.toString?.() || it.productId?.toString?.() : (it.productId || it.id || ''),
          quantity: it.quantity,
        })) || o.items || [],
        total: o.total,
        status: 'paid' as const,
        createdAt: o.createdAt,
      }));
      setOrders(list);
    } catch (e) {
      console.warn('Fetch orders failed:', e);
    }
  }, []);

  const checkout = useCallback(
    async (total: number): Promise<CheckoutResult> => {
      if (!user) {
        return { ok: false, error: "Vui lòng đăng nhập để thanh toán." };
      }

      if (!user.emailVerified) {
        return { ok: false, error: "Vui lòng xác thực email trước khi mua." };
      }

      if (cart.length === 0) {
        return { ok: false, error: "Giỏ hàng trống." };
      }

      try {
        const data = await apiFetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify({ items: cart }),
        });

        const orderedItems = [...cart];
        if (typeof data.balance === 'number') setBalance(data.balance);
        clearCart();
        await fetchOrders();

        return { ok: true, orderId: data.orderId, items: orderedItems };
      } catch (error: any) {
        console.error('Checkout error:', error);
        return { ok: false, error: error.message || 'Thanh toán thất bại.' };
      }
    },
    [user, cart, clearCart, fetchOrders]
  );

  // Tải orders khi đã đăng nhập
  useEffect(() => {
    if (user) fetchOrders();
    else setOrders([]);
  }, [user, fetchOrders]);

  const topup = useCallback(async (amount: number) => {
    try {
      const data = await apiFetch('/api/topup', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      if (typeof data.balance === 'number') setBalance(data.balance);
      return { ok: true as const, balance: data.balance, message: data.message };
    } catch (error: any) {
      return { ok: false as const, error: error.message || 'Nạp tiền thất bại.' };
    }
  }, []);

  const value: AuthContextValue = {
    user,
    balance,
    cart,
    cartCount,
    loading,
    register,
    login,
    verifyEmail,
    resendVerification,
    logout,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    checkout,
    topup,
    getOrders,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function getPendingVerifyUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PENDING_VERIFY_KEY);
}