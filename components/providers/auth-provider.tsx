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
const USERS_KEY = "linh-nam-users";
const CURRENT_USER_KEY = "linh-nam-current-user";
const ORDERS_KEY = "linh-nam-orders";

interface StoredUser extends User {
  password: string;
  verificationCode: string;
  balance: number;
}

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
  demoCode?: string;
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
  getOrders: () => Order[];
}

const AuthCtx = createContext<AuthContextValue | null>(null);

function getStoredUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getStoredOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function createSessionUser(user: StoredUser): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
  };
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

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }
  
  return data;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(150_000);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.warn('Verify API failed, using cached user:', error);
        setUser(JSON.parse(userData));
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
        const data = await apiFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });

        if (data.userId) {
          localStorage.setItem(PENDING_VERIFY_KEY, data.userId);
        }

        return {
          ok: true,
          userId: data.user?.id || data.userId,
          needsVerification: true,
        };
      } catch (error: any) {
        console.error('Register error:', error);
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

        return { ok: true };
      } catch (error: any) {
        console.error('Login error:', error);
        
        recordFailedLogin();
        
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

        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.removeItem(PENDING_VERIFY_KEY);
          return { ok: true };
        }

        return { 
          ok: false, 
          error: data.error || 'Xác thực thất bại' 
        };
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
        const data = await apiFetch('/api/auth/resend-verification', {
          method: 'POST',
          body: JSON.stringify({ userId }),
        });

        return {
          ok: true,
          demoCode: data.code,
        };
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
    localStorage.removeItem(CURRENT_USER_KEY);
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
    if (!user) return [];
    return getStoredOrders().filter((order) => order.userId === user.id);
  }, [user]);

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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = getStoredUsers();
      const userIdx = users.findIndex((storedUser) => storedUser.id === user.id);

      if (userIdx === -1) {
        return { ok: false, error: "Tài khoản không tồn tại." };
      }

      const userObj = users[userIdx];
      if (userObj.balance < total) {
        return { ok: false, error: "Số dư Linh Thạch không đủ." };
      }

      const orderedItems = [...cart];
      const updatedUser: StoredUser = {
        ...userObj,
        balance: userObj.balance - total,
      };

      users[userIdx] = updatedUser;
      saveStoredUsers(users);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      setBalance(updatedUser.balance);

      const orderId = "order_" + Math.random().toString(36).substring(2, 9).toUpperCase();
      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        items: orderedItems,
        total,
        status: "paid",
        createdAt: new Date().toISOString(),
      };

      const orders = getStoredOrders();
      orders.push(newOrder);
      saveStoredOrders(orders);
      clearCart();

      return { ok: true, orderId, items: orderedItems };
    },
    [user, cart, clearCart]
  );

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