"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import type { InventoryRow } from "./admin-types";
import { adminFetch } from "./admin-types";

export default function InventoryEditor({
  row,
  busy,
  onSaved,
  notify,
}: {
  row: InventoryRow;
  busy: boolean;
  onSaved: (products: InventoryRow[]) => void;
  notify: (m: string, isErr?: boolean) => void;
}) {
  const [price, setPrice] = useState(String(row.priceValue));
  const [stock, setStock] = useState(String(row.stock));
  const [saving, setSaving] = useState(false);

  return (
    <div className="border border-gold/15 p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex-1">
        <p className="font-semibold">{row.name}</p>
        <p className="text-xs text-bone/50">{row.productId}</p>
      </div>
      <label className="text-xs text-bone/60">
        Giá (LT)
        <input
          type="number" min={0} value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="ml-2 w-28 border border-gold/20 bg-mist/50 px-2 py-2 text-bone outline-none"
        />
      </label>
      <label className="text-xs text-bone/60">
        Kho (-1 = ∞)
        <input
          type="number" min={-1} value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="ml-2 w-24 border border-gold/20 bg-mist/50 px-2 py-2 text-bone outline-none"
        />
      </label>
      <Button
        variant="primary"
        disabled={busy || saving}
        onClick={async () => {
          setSaving(true);
          try {
            const data = await adminFetch("/api/products", {
              method: "PUT",
              body: JSON.stringify({ productId: row.productId, priceValue: Number(price), stock: Number(stock) }),
            });
            onSaved((data.products || []).map((p: InventoryRow) => ({
              productId: p.productId, name: p.name, priceValue: p.priceValue, stock: p.stock,
            })));
            notify(`Đã cập nhật ${row.name}.`);
          } catch (e) {
            notify(e instanceof Error ? e.message : "Lỗi.", true);
          } finally {
            setSaving(false);
          }
        }}
      >
        {saving ? "Đang lưu…" : "Lưu"}
      </Button>
    </div>
  );
}
