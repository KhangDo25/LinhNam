"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import type { AdminUser } from "./admin-types";
import { adminFetch } from "./admin-types";

export default function UserEditor({
  member,
  busy,
  notify,
  onChanged,
  onDeleted,
}: {
  member: AdminUser;
  busy: boolean;
  notify: (m: string, isErr?: boolean) => void;
  onChanged: (u: Partial<AdminUser>) => void;
  onDeleted: () => void;
}) {
  const [delta, setDelta] = useState("");
  const [newPass, setNewPass] = useState("");

  const patch = async (body: Record<string, unknown>, okMsg: string) => {
    try {
      const data = await adminFetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId: member.id, ...body }),
      });
      onChanged(data.user);
      notify(okMsg);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Lỗi.", true);
    }
  };

  return (
    <div className="border border-gold/15 p-4 space-y-2">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <p className="font-semibold">
            {member.name}{" "}
            {member.locked && <span className="text-crimson text-xs">(đang khóa)</span>}
          </p>
          <p className="text-xs text-bone/50">
            {member.email} · {member.balance.toLocaleString("vi-VN")} LT · {member.role}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={member.role}
            disabled={busy}
            onChange={(e) => patch({ role: e.target.value }, "Đã đổi quyền.")}
            className="bg-mist border border-gold/20 text-xs px-2 py-2"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <Button variant="outline" disabled={busy} onClick={() => patch({ unlock: true }, "Đã mở khóa.")}>
            Mở khóa
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={async () => {
              if (!confirm(`Xóa thành viên ${member.email}?`)) return;
              try {
                await adminFetch(`/api/admin/users?userId=${member.id}`, { method: "DELETE" });
                onDeleted();
                notify("Đã xóa thành viên.");
              } catch (e) {
                notify(e instanceof Error ? e.message : "Lỗi.", true);
              }
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          placeholder="± LT (vd: 50000)"
          type="number"
          className="w-52 border border-gold/20 bg-mist/50 px-3 py-2 text-sm outline-none"
        />
        <Button
          variant="outline"
          disabled={busy || !delta}
          onClick={() => {
            patch({ balanceDelta: Number(delta) }, "Đã điều chỉnh số dư.");
            setDelta("");
          }}
        >
          Cộng/trừ LT
        </Button>
        <input
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          placeholder="Mật khẩu mới (reset)"
          type="text"
          className="w-52 border border-gold/20 bg-mist/50 px-3 py-2 text-sm outline-none"
        />
        <Button
          variant="outline"
          disabled={busy || !newPass}
          onClick={() => {
            patch({ newPassword: newPass }, "Đã reset mật khẩu.");
            setNewPass("");
          }}
        >
          Reset MK
        </Button>
      </div>
    </div>
  );
}
