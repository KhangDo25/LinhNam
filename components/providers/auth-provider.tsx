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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(150_000);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const stored = localStorage.getItem("linh-nam-current-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Load fresh user data from "linh-nam-users" database in localStorage
        const users = JSON.parse(localStorage.getItem("linh-nam-users") ?? "[]") as any[];
        const dbUser = users.find((u) => u.id === parsed.id);
        
        if (dbUser) {
          setUser({
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            createdAt: dbUser.createdAt,
            emailVerified: dbUser.emailVerified,
          });
          setBalance(dbUser.balance);
          localStorage.setItem("linh-nam-current-user", JSON.stringify(dbUser));
          return;
        }
      }
      setUser(null);
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
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem("linh-nam-users") ?? "[]") as any[];
      const trimmedEmail = email.trim().toLowerCase();

      if (users.some((u) => u.email === trimmedEmail)) {
        return { ok: false, error: "Email này đã được sử dụng." };
      }

      const userId = "user_" + Math.random().toString(36).substring(2, 9);
      const demoCode = String(Math.floor(100000 + Math.random() * 900000));

      const newUser = {
        id: userId,
        email: trimmedEmail,
        name: name.trim(),
        password: password, // For client-side simulation, we match password directly
        createdAt: new Date().toISOString(),
        emailVerified: false,
        verificationCode: demoCode,
        balance: 150_000,
      };

      users.push(newUser);
      localStorage.setItem("linh-nam-users", JSON.stringify(users));
      localStorage.setItem(PENDING_VERIFY_KEY, userId);
      
      // Save code in sessionStorage so verification page can pre-display it for demo ease
      sessionStorage.setItem("linh-nam-demo-otp", demoCode);

      return { ok: true, userId, demoCode };
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const lockMsg = getLoginLockoutMessage();
      if (lockMsg) return { ok: false, error: lockMsg };

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem("linh-nam-users") ?? "[]") as any[];
      const trimmedEmail = email.trim().toLowerCase();
      const userObj = users.find((u) => u.email === trimmedEmail);

      if (!userObj || userObj.password !== password) {
        recordFailedLogin();
        return { ok: false, error: "Email hoặc mật khẩu không đúng." };
      }

      if (!userObj.emailVerified) {
        // Expose code so they can verify if they register, log out, then log in again without verifying
        sessionStorage.setItem("linh-nam-demo-otp", userObj.verificationCode);
        return {
          ok: false,
          needsVerification: true,
          userId: userObj.id,
          error: "Tài khoản chưa xác thực email.",
        };
      }

      clearLoginAttempts();
      
      const sessionUser: User = {
        id: userObj.id,
        email: userObj.email,
        name: userObj.name,
        createdAt: userObj.createdAt,
        emailVerified: userObj.emailVerified,
      };

      setUser(sessionUser);
      setBalance(userObj.balance);
      localStorage.setItem("linh-nam-current-user", JSON.stringify(userObj));
      return { ok: true };
    },
    []
  );

  const verifyEmail = useCallback(
    async (userId: string, code: string): Promise<AuthResult> => {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = JSON.parse(localStorage.getItem("linh-nam-users") ?? "[]") as any[];
      const userIdx = users.findIndex((u) => u.id === userId);

      if (userIdx === -1) {
        return { ok: false, error: "Tài khoản không tồn tại." };
      }

      const userObj = users[userIdx];
      if (userObj.verificationCode !== code) {
        return { ok: false, error: "Mã xác thực không chính xác." };
      }

      userObj.emailVerified = true;
      users[userIdx] = userObj;
      localStorage.setItem("linh-nam-users", JSON.stringify(users));

      // Log the user in
      const sessionUser: User = {
        id: userObj.id,
        email: userObj.email,
        name: userObj.name,
        createdAt: userObj.createdAt,
        emailVerified: userObj.emailVerified,
      };

      setUser(sessionUser);
      setBalance(userObj.balance);
      localStorage.setItem("linh-nam-current-user", JSON.stringify(userObj));
      localStorage.removeItem(PENDING_VERIFY_KEY);

      return { ok: true };
    },
    []
  );

  const resendVerification = useCallback(async (userId: string): Promise<AuthResult> => {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem("linh-nam-users") ?? "[]") as any[];
    const userIdx = users.findIndex((u) => u.id === userId);

    if (userIdx === -1) {
      return { ok: false, error: "Tài khoản không tồn tại." };
    }

    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    users[userIdx].verificationCode = newCode;
    localStorage.setItem("linh-nam-users", JSON.stringify(users));
    sessionStorage.setItem("linh-nam-demo-otp", newCode);

    return { ok: true, demoCode: newCode };
  }, []);

  const logout = useCallback(async () => {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem("linh-nam-current-user");
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

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem("linh-nam-users") ?? "[]") as any[];
      const userIdx = users.findIndex((u) => u.id === user.id);

      if (userIdx === -1) {
        return { ok: false, error: "Tài khoản không tồn tại." };
      }

      const userObj = users[userIdx];
      if (userObj.balance < total) {
        return { ok: false, error: "Số dư Linh Thạch không đủ." };
      }

      userObj.balance -= total;
      users[userIdx] = userObj;

      localStorage.setItem("linh-nam-users", JSON.stringify(users));
      localStorage.setItem("linh-nam-current-user", JSON.stringify(userObj));

      setBalance(userObj.balance);
      clearCart();

      const orderId = "order_" + Math.random().toString(36).substring(2, 9).toUpperCase();

      // Save order info locally
      const orders = JSON.parse(localStorage.getItem("linh-nam-orders") ?? "[]");
      orders.push({
        id: orderId,
        userId: user.id,
        items: cart,
        total,
        status: "paid",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("linh-nam-orders", JSON.stringify(orders));

      return { ok: true, orderId };
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

