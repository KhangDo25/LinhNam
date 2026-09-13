"use client";

import { useState } from "react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { adminFetch } from "./admin-types";

export default function AdminTopup({
  notify,
}: {
  notify: (m: string, isErr?: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("100000");
  const [busy, setBusy] = useState(false);

  return (
    <Card className="p-6 space-y-4" glow>
      <p className="text-[10px] uppercase tracking-widest text-bone/50">
        Nạp Linh Thạch cho thành viên (bằng email)
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@vd.com"
          className="flex-1 border border-gold/20 bg-mist/50 px-4 py-3 text-sm outline-none min-h-[48px]"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Số LT"
          type="number"
          min={1}
          className="w-40 border border-gold/20 bg-mist/50 px-4 py-3 text-sm outline-none min-h-[48px]"
        />
        <Button
          variant="primary"
          disabled={busy || !email || !amount}
          onClick={async () => {
            setBusy(true);
            try {
              const data = await adminFetch("/api/topup", {
                method: "POST",
                body: JSON.stringify({ amount: Number(amount), targetEmail: email }),
              });
              notify(data.message || "Đã nạp tiền.");
            } catch (e) {
              notify(e instanceof Error ? e.message : "Lỗi.", true);
            } finally {
              setBusy(false);
            }
          }}
        >
          Nạp tiền
        </Button>
      </div>
      <p className="text-xs text-bone/40">
        Admin nạp hộ user khác bằng email — không giới hạn min 10.000 như tự nạp.
      </p>
    </Card>
  );
}
