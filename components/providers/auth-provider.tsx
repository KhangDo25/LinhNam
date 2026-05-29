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

type AuthResult = { ok: boolean; error?: string; needsVerification?: boolean; userId?: string; demoCode?: string };

interface AuthContextValue {
  user: User | null;
  balance: number;
  cart: CartItem[];
  cartCount: number;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyEmail: (userId: string, code: string) => Promise<AuthResult>;
  resendVerification: (userId: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  addToCart: (productId: string, qty?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (total: number) => Promise<{ ok: boolean; error?: string; orderId?: string }>;
}

const AuthCtx = createContext<AuthContextValue | null>(null);

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(150_000);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await parseJson<{
        ok: boolean;
        user: User | null;
        balance: number;
      }>(res);
      if (data.ok && data.user) {
        setUser(data.user);
        setBalance(data.balance);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshSession();
      try {
        setCart(JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"));
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, [refreshSession]);

  useEffect(() => {
    if (!loading) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, loading]);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await parseJson<AuthResult & { userId?: string }>(res);
      if (data.ok && data.userId) {
        localStorage.setItem(PENDING_VERIFY_KEY, data.userId);
      }
      return data;
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const lockMsg = getLoginLockoutMessage();
      if (lockMsg) return { ok: false, error: lockMsg };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJson<
        AuthResult & { user?: User; balance?: number; userId?: string }
      >(res);

      if (!data.ok) {
        if (!data.needsVerification) recordFailedLogin();
        if (data.needsVerification && data.userId) {
          localStorage.setItem(PENDING_VERIFY_KEY, data.userId);
        }
        return data;
      }

      clearLoginAttempts();
      if (data.user) setUser(data.user);
      if (typeof data.balance === "number") setBalance(data.balance);
      return { ok: true };
    },
    []
  );

  const verifyEmail = useCallback(
    async (userId: string, code: string): Promise<AuthResult> => {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, code }),
      });
      const data = await parseJson<AuthResult & { user?: User; balance?: number }>(res);
      if (data.ok) {
        if (data.user) setUser(data.user);
        if (typeof data.balance === "number") setBalance(data.balance);
        localStorage.removeItem(PENDING_VERIFY_KEY);
      }
      return data;
    },
    []
  );

  const resendVerification = useCallback(async (userId: string): Promise<AuthResult> => {
    const res = await fetch("/api/auth/resend-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return parseJson(res);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { productId, quantity: qty }];
    });
  }, []);

  const updateCartQty = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback(
    async (total: number) => {
      if (!user) return { ok: false, error: "Vui lòng đăng nhập để thanh toán." };
      if (!user.emailVerified) {
        return { ok: false, error: "Vui lòng xác thực email trước khi mua." };
      }
      if (cart.length === 0) return { ok: false, error: "Giỏ hàng trống." };

      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: cart }),
      });
      const data = await parseJson<{
        ok: boolean;
        error?: string;
        orderId?: string;
        balance?: number;
      }>(res);

      if (!data.ok) return { ok: false, error: data.error ?? "Thanh toán thất bại." };
      if (typeof data.balance === "number") setBalance(data.balance);
      clearCart();
      return { ok: true, orderId: data.orderId };
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
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getPendingVerifyUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PENDING_VERIFY_KEY);
}
