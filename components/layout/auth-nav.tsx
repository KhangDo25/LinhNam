"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { user, cartCount, balance, logout, loading } = useAuth();

  if (loading) return null;

  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/gio-hang"
          className="flex items-center gap-3 text-sm text-bone py-2 mobile-touch"
        >
          <ShoppingCart size={20} />
          Giỏ hàng {cartCount > 0 && `(${cartCount})`}
        </Link>
        {user ? (
          <>
            <Link href="/tai-khoan" className="flex items-center gap-3 text-sm py-2 mobile-touch">
              <User size={20} />
              {user.name} — {balance.toLocaleString("vi-VN")} LT
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-3 text-sm text-bone/60 py-2 mobile-touch"
            >
              <LogOut size={20} />
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/dang-nhap" className="text-sm py-3 mobile-touch text-center border border-gold/30 text-gold">
              Đăng nhập
            </Link>
            <Link href="/dang-ky" className="text-sm py-3 mobile-touch text-center bg-gold text-void font-semibold">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/gio-hang"
        className="relative flex items-center justify-center text-bone/70 hover:text-gold transition-colors mobile-touch"
        aria-label="Giỏ hàng"
      >
        <ShoppingCart size={18} />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-void px-0.5">
            {cartCount}
          </span>
        )}
      </Link>

      {user ? (
        <>
          <span className="text-[10px] text-gold/80 tracking-wider hidden lg:inline">
            {balance.toLocaleString("vi-VN")} LT
          </span>
          <Link
            href="/tai-khoan"
            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-bone/70 hover:text-gold mobile-touch"
          >
            <User size={14} />
            <span className="max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-bone/50 hover:text-gold transition-colors mobile-touch"
            aria-label="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        </>
      ) : (
        <>
          <Link
            href="/dang-nhap"
            className="text-[10px] uppercase tracking-[0.2em] text-bone/70 hover:text-gold hidden sm:inline"
          >
            Đăng nhập
          </Link>
          <Link
            href="/dang-ky"
            className="text-[10px] uppercase tracking-[0.2em] border border-gold/40 px-2.5 py-1.5 text-gold hover:bg-gold/10"
          >
            Đăng ký
          </Link>
        </>
      )}
    </div>
  );
}
