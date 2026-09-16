"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coins, History, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function TaiKhoanPage() {
  const { user, balance, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/dang-nhap");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pb-32">
        <h1 className="font-heading text-4xl text-gold mb-8">Tài Khoản</h1>
        <Card className="p-8 space-y-4" glow>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-bone/50">Họ tên</p>
            <p className="text-lg text-bone">{user.name}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-bone/50">Email</p>
            <p className="text-bone/80">{user.email}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-bone/50">Linh Thạch</p>
            <p className="text-2xl text-gold font-heading">
              {balance.toLocaleString("vi-VN")} LT
            </p>
            <Link href="/nap-tien" className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">
              <Coins size={14} /> Nạp thêm Linh Thạch
            </Link>
          </div>
          <p className="text-xs text-bone/50 pt-2">
            Tài khoản đã xác thực email — dữ liệu đơn hàng lưu trên máy chủ.
          </p>
        </Card>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/nap-tien">
            <Button variant="primary" className="w-full">
              <span className="inline-flex items-center gap-2">
                <Coins size={16} /> Nạp Tiền
              </span>
            </Button>
          </Link>
          <Link href="/lich-su-mua-hang">
            <Button variant="outline" className="w-full">
              <span className="inline-flex items-center gap-2">
                <History size={16} /> Lịch Sử Mua Hàng
              </span>
            </Button>
          </Link>
          {user.role === "admin" && (
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} /> Trang Quản Trị
                </span>
              </Button>
            </Link>
          )}
          <Link href="/gio-hang">
            <Button variant="outline" className="w-full">
              Giỏ hàng
            </Button>
          </Link>
          <Link href="/cua-hang">
            <Button variant="primary" className="w-full">
              Cửa hàng
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </PageAtmosphere>
  );
}
