"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type OrderRow = {
  id: string;
  program_label: string;
  account_size: string;
  fee_usdt: string | number;
  platform: string;
  status: string;
  payment_method: string;
  created_at: string;
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading orders…</p>}>
      <OrdersTable />
    </Suspense>
  );
}

function OrdersTable() {
  const search = useSearchParams();
  const placed = search.get("placed") === "1";
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        const payload = (await res.json().catch(() => null)) as { orders?: OrderRow[]; error?: string } | null;
        if (!res.ok) {
          setError(payload?.error || "Could not load orders.");
          return;
        }
        setOrders(payload?.orders || []);
      })
      .catch(() => setError("Could not reach the MixFunded backend."));
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Challenge orders stored in Neon. Demo USDT — paid without an on-chain transfer.
      </p>

      {placed && (
        <p className="mt-4 rounded-[6px] border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3 text-sm">
          Order created. A confirmation mail was sent if Gmail is configured.
        </p>
      )}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-[6px] border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Program</th>
              <th className="px-5 py-3 font-medium">Size</th>
              <th className="px-5 py-3 font-medium">Platform</th>
              <th className="px-5 py-3 font-medium">Fee</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-muted-foreground" colSpan={5}>
                  No orders yet.{" "}
                  <a href="/checkout" className="text-[color:var(--accent)]">
                    Create one
                  </a>
                  .
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-5 py-3">{order.program_label}</td>
                  <td className="px-5 py-3 font-mono-nums">{order.account_size}</td>
                  <td className="px-5 py-3">{order.platform}</td>
                  <td className="px-5 py-3 font-mono-nums">${Number(order.fee_usdt)} USDT</td>
                  <td className="px-5 py-3 capitalize text-[color:var(--accent)]">
                    {order.status} · demo
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
