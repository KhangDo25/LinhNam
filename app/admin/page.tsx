"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import PageAtmosphere from "@/components/layout/page-atmosphere";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import InventoryEditor from "@/components/admin/inventory-editor";
import UserEditor from "@/components/admin/user-editor";
import AdminTopup from "@/components/admin/admin-topup";
import type { AdminOrder, AdminTab, AdminUser, InventoryRow } from "@/components/admin/admin-types";
import { adminFetch } from "@/components/admin/admin-types";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<{ users: number; orders: number; revenue: number; products: number } | null>(null);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!loading && !user) router.replace("/dang-nhap");
    else if (!loading && user && user.role !== "admin") router.replace("/");
  }, [user, loading, router]);
  const notify = (m: string, isErr?: boolean) => (isErr ? setErr(m) : setMsg(m));
  const loadOverview = useCallback(async () => {
    const data = await adminFetch("/api/admin/stats");
    setStats(data.stats);
    setInventory(data.inventory || []);
    setOrders(data.recentOrders || []);
  }, []);
  const loadUsers = useCallback(async () => {
    const data = await adminFetch(`/api/admin/users?q=${encodeURIComponent(userQuery)}&limit=50`);
    setUsers(data.users || []);
  }, [userQuery]);
  const loadOrders = useCallback(async () => {
    const data = await adminFetch("/api/orders?all=1&limit=50");
    setOrders(data.orders || []);
  }, []);
  const loadInventory = useCallback(async () => {
    const data = await adminFetch("/api/products");
    setInventory(data.products || []);
  }, []);
  useEffect(() => {
    if (!isAdmin) return;
    setErr("");
    if (tab === "overview") loadOverview().catch((e) => setErr(e.message));
    if (tab === "inventory") loadInventory().catch((e) => setErr(e.message));
    if (tab === "orders") loadOrders().catch((e) => setErr(e.message));
    if (tab === "users") loadUsers().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isAdmin]);
  if (loading || !user) return null;
  if (!isAdmin) return null;
  const runAction = async (fn: () => Promise<void>, okMsg: string) => {
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      await fn();
      setMsg(okMsg);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setBusy(false);
    }
  };
  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Tổng quan" },
    { id: "inventory", label: "Kho & Giá" },
    { id: "orders", label: "Đơn hàng" },
    { id: "users", label: "Thành viên" },
    { id: "topup", label: "Nạp tiền" },
  ];
  return (
    <PageAtmosphere variant="gold" className="text-bone pt-32 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">
        <h1 className="font-heading text-4xl text-gold mb-2">Quản Trị</h1>
        <p className="text-sm text-bone/60 mb-6">Xin chào {user.name} — quản lý kho, giá, đơn hàng, thành viên, nạp tiền.</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border min-h-[44px] ${
                tab === t.id ? "border-gold bg-gold/15 text-gold" : "border-gold/20 text-bone/60 hover:border-gold/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {err && <p className="text-sm text-crimson bg-crimson/10 border border-crimson/20 p-3 rounded mb-4">{err}</p>}
        {msg && <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 p-3 rounded mb-4">{msg}</p>}
        {tab === "overview" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Thành viên", value: stats.users.toLocaleString("vi-VN") },
              { label: "Đơn hàng", value: stats.orders.toLocaleString("vi-VN") },
              { label: "Doanh thu (LT)", value: stats.revenue.toLocaleString("vi-VN") },
              { label: "Sản phẩm", value: stats.products.toLocaleString("vi-VN") },
            ].map((s) => (
              <Card key={s.label} className="p-5" glow>
                <p className="text-[10px] uppercase tracking-widest text-bone/50">{s.label}</p>
                <p className="text-2xl text-gold font-heading mt-1">{s.value}</p>
              </Card>
            ))}
          </div>
        )}
        {tab === "topup" && <AdminTopup notify={notify} />}
        {tab === "inventory" && (
          <Card className="p-5" glow>
            <p className="text-[10px] uppercase tracking-widest text-bone/50 mb-4">Kho hàng — sửa giá / số lượng (stock -1 = vô hạn)</p>
            <div className="space-y-3">
              {inventory.map((row) => (
                <InventoryEditor key={row.productId} row={row} busy={busy} notify={notify} onSaved={setInventory} />
              ))}
            </div>
          </Card>
        )}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && <Card className="p-8 text-center text-bone/50">Chưa có đơn hàng nào.</Card>}
            {orders.map((o) => (
              <Card key={o._id} className="p-5" glow>
                <div className="flex flex-wrap justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-bone/50">Mã đơn</p>
                    <p className="text-sm text-gold font-semibold">{o._id.slice(0, 12).toUpperCase()}</p>
                    <p className="text-xs text-bone/50 mt-1">
                      {typeof o.userId === "object" ? `${o.userId?.name} (${o.userId?.email})` : ""}{" · "}
                      {new Date(o.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-semibold">{o.total.toLocaleString("vi-VN")} LT</p>
                    <select
                      value={o.status}
                      disabled={busy}
                      onChange={(e) => {
                        const status = e.target.value;
                        runAction(async () => {
                          await adminFetch("/api/orders", { method: "PATCH", body: JSON.stringify({ orderId: o._id, status }) });
                          setOrders((prev) => prev.map((x) => (x._id === o._id ? { ...x, status } : x)));
                        }, "Đã cập nhật trạng thái đơn.");
                      }}
                      className="mt-2 bg-mist border border-gold/20 text-xs px-2 py-2 text-bone"
                    >
                      {["pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {o.items?.map((it, i) => (
                    <div key={i} className="flex justify-between text-bone/70">
                      <span>{it.name} × {it.quantity}</span>
                      <span>{(it.price * it.quantity).toLocaleString("vi-VN")} LT</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab === "users" && (
          <Card className="p-5" glow>
            <div className="flex gap-2 mb-4">
              <input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Tìm theo tên / email…"
                className="flex-1 border border-gold/20 bg-mist/50 px-4 py-3 text-sm text-bone focus:border-gold outline-none min-h-[48px]"
              />
              <Button variant="outline" onClick={() => loadUsers().catch((e) => setErr(e.message))}>Tìm</Button>
            </div>
            <div className="space-y-3">
              {users.map((u) => (
                <UserEditor
                  key={u.id}
                  member={u}
                  busy={busy}
                  notify={notify}
                  onChanged={(updated) => setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...updated } : x)))}
                  onDeleted={() => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
                />
              ))}
              {users.length === 0 && <p className="text-sm text-bone/50 text-center py-6">Nhấn Tìm để liệt kê thành viên.</p>}
            </div>
          </Card>
        )}
      </div>
    </PageAtmosphere>
  );
}
