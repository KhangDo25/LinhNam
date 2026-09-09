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
const DEMO_OTP_KEY = "linh-nam-demo-otp";

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

    if (!stored) {
      return [];
    }

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

    if (!stored) {
      return [];
    }

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
      const stored = localStorage.getItem(CURRENT_USER_KEY);

      if (!stored) {
        setUser(null);
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (!parsed || typeof parsed !== "object") {
        setUser(null);
        return;
      }

      const session = parsed as StoredUser;
      const users = getStoredUsers();

      const dbUser = users.find(
        (storedUser) => storedUser.id === session.id
      );

      if (!dbUser) {
        setUser(null);
        return;
      }

      setUser(createSessionUser(dbUser));
      setBalance(dbUser.balance);

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(dbUser)
      );
    } catch {
      setUser(null);
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
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
      );
    }
  }, [cart, loading]);

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cart]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<AuthResult> => {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      const users = getStoredUsers();
      const trimmedEmail = email.trim().toLowerCase();

      if (
        users.some(
          (storedUser) =>
            storedUser.email === trimmedEmail
        )
      ) {
        return {
          ok: false,
          error: "Email này đã được sử dụng.",
        };
      }

      const userId =
        "user_" +
        Math.random()
          .toString(36)
          .substring(2, 9);

      const demoCode = String(
        Math.floor(
          100000 + Math.random() * 900000
        )
      );

      const newUser: StoredUser = {
        id: userId,
        email: trimmedEmail,
        name: name.trim(),
        password,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        verificationCode: demoCode,
        balance: 150_000,
      };

      users.push(newUser);

      saveStoredUsers(users);

      localStorage.setItem(
        PENDING_VERIFY_KEY,
        userId
      );

      sessionStorage.setItem(
        DEMO_OTP_KEY,
        demoCode
      );

      return {
        ok: true,
        userId,
        demoCode,
      };
    },
    []
  );

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<AuthResult> => {
      const lockMsg = getLoginLockoutMessage();

      if (lockMsg) {
        return {
          ok: false,
          error: lockMsg,
        };
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      const users = getStoredUsers();

      const trimmedEmail =
        email.trim().toLowerCase();

      const userObj = users.find(
        (storedUser) =>
          storedUser.email === trimmedEmail
      );

      if (
        !userObj ||
        userObj.password !== password
      ) {
        recordFailedLogin();

        return {
          ok: false,
          error:
            "Email hoặc mật khẩu không đúng.",
        };
      }

      if (!userObj.emailVerified) {
        sessionStorage.setItem(
          DEMO_OTP_KEY,
          userObj.verificationCode
        );

        return {
          ok: false,
          needsVerification: true,
          userId: userObj.id,
          error:
            "Tài khoản chưa xác thực email.",
        };
      }

      clearLoginAttempts();

      setUser(createSessionUser(userObj));
      setBalance(userObj.balance);

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(userObj)
      );

      return {
        ok: true,
      };
    },
    []
  );

  const verifyEmail = useCallback(
    async (
      userId: string,
      code: string
    ): Promise<AuthResult> => {
      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      const users = getStoredUsers();

      const userIdx = users.findIndex(
        (storedUser) =>
          storedUser.id === userId
      );

      if (userIdx === -1) {
        return {
          ok: false,
          error: "Tài khoản không tồn tại.",
        };
      }

      const userObj = users[userIdx];

      if (userObj.verificationCode !== code) {
        return {
          ok: false,
          error:
            "Mã xác thực không chính xác.",
        };
      }

      const verifiedUser: StoredUser = {
        ...userObj,
        emailVerified: true,
      };

      users[userIdx] = verifiedUser;

      saveStoredUsers(users);

      setUser(createSessionUser(verifiedUser));
      setBalance(verifiedUser.balance);

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(verifiedUser)
      );

      localStorage.removeItem(
        PENDING_VERIFY_KEY
      );

      return {
        ok: true,
      };
    },
    []
  );

  const resendVerification = useCallback(
    async (
      userId: string
    ): Promise<AuthResult> => {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      const users = getStoredUsers();

      const userIdx = users.findIndex(
        (storedUser) =>
          storedUser.id === userId
      );

      if (userIdx === -1) {
        return {
          ok: false,
          error: "Tài khoản không tồn tại.",
        };
      }

      const newCode = String(
        Math.floor(
          100000 + Math.random() * 900000
        )
      );

      const updatedUser: StoredUser = {
        ...users[userIdx],
        verificationCode: newCode,
      };

      users[userIdx] = updatedUser;

      saveStoredUsers(users);

      sessionStorage.setItem(
        DEMO_OTP_KEY,
        newCode
      );

      return {
        ok: true,
        demoCode: newCode,
      };
    },
    []
  );

  const logout = useCallback(async () => {
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    setUser(null);
  }, []);

  const addToCart = useCallback(
    (productId: string, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find(
          (item) =>
            item.productId === productId
        );

        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + qty,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            productId,
            quantity: qty,
          },
        ];
      });
    },
    []
  );

  const updateCartQty = useCallback(
    (
      productId: string,
      quantity: number
    ) => {
      if (quantity < 1) {
        setCart((prev) =>
          prev.filter(
            (item) =>
              item.productId !== productId
          )
        );

        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity,
              }
            : item
        )
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            item.productId !== productId
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getOrders = useCallback(() => {
    if (!user) {
      return [];
    }

    return getStoredOrders().filter(
      (order) => order.userId === user.id
    );
  }, [user]);

  const checkout = useCallback(
    async (
      total: number
    ): Promise<CheckoutResult> => {
      if (!user) {
        return {
          ok: false,
          error:
            "Vui lòng đăng nhập để thanh toán.",
        };
      }

      if (!user.emailVerified) {
        return {
          ok: false,
          error:
            "Vui lòng xác thực email trước khi mua.",
        };
      }

      if (cart.length === 0) {
        return {
          ok: false,
          error: "Giỏ hàng trống.",
        };
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      const users = getStoredUsers();

      const userIdx = users.findIndex(
        (storedUser) =>
          storedUser.id === user.id
      );

      if (userIdx === -1) {
        return {
          ok: false,
          error:
            "Tài khoản không tồn tại.",
        };
      }

      const userObj = users[userIdx];

      if (userObj.balance < total) {
        return {
          ok: false,
          error:
            "Số dư Linh Thạch không đủ.",
        };
      }

      const orderedItems = [...cart];

      const updatedUser: StoredUser = {
        ...userObj,
        balance:
          userObj.balance - total,
      };

      users[userIdx] = updatedUser;

      saveStoredUsers(users);

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(updatedUser)
      );

      setBalance(updatedUser.balance);

      const orderId =
        "order_" +
        Math.random()
          .toString(36)
          .substring(2, 9)
          .toUpperCase();

      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        items: orderedItems,
        total,
        status: "paid",
        createdAt:
          new Date().toISOString(),
      };

      const orders = getStoredOrders();

      orders.push(newOrder);

      saveStoredOrders(orders);

      clearCart();

      return {
        ok: true,
        orderId,
        items: orderedItems,
      };
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

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}

export function getPendingVerifyUserId(): string | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    PENDING_VERIFY_KEY
  );
}