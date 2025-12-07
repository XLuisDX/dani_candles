"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";

type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded";

interface ShippingAddress {
  full_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface AdminOrder {
  id: string;
  created_at: string | null;
  status: OrderStatus;
  payment_status: string;
  total_cents: number;
  currency_code: string;
  customer_email: string | null;
  shipping_address: ShippingAddress | null;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  canceled: "Canceled",
  refunded: "Refunded",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  paid: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  preparing: "border-sky-500/40 text-sky-300 bg-sky-500/10",
  shipped: "border-sky-500/40 text-sky-300 bg-sky-500/10",
  delivered: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  canceled: "border-red-500/40 text-red-300 bg-red-500/10",
  refunded: "border-purple-500/40 text-purple-300 bg-purple-500/10",
};

const NEXT_STEPS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["paid", "canceled"],
  paid: ["preparing", "shipped", "canceled"],
  preparing: ["shipped", "canceled"],
  shipped: ["delivered"],
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }
      const email = data.user.email ?? null;
      if (!isAdminEmail(email)) {
        router.push("/");
        return;
      }
    };
    checkAdmin();
  }, [router]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error(error);
        setError("Could not load orders.");
      } else {
        setOrders(data as AdminOrder[]);
      }

      setLoading(false);
    };

    loadOrders();
  }, []);

  const visibleOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const changeStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .single();

      if (error || !data) {
        console.error(error);
        setError("Could not update order status.");
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? (data as AdminOrder) : o))
        );

        if (newStatus === "shipped") {
          void fetch("/api/admin/order-status-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          }).catch((err) => {
            console.error(
              "[AdminOrders] Error calling order-status-email:",
              err
            );
          });
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Admin · Orders
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and manage customer orders for Dani Candles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as OrderStatus | "all")
            }
            className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-400"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="preparing">Preparing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-zinc-400">Loading orders...</p>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {!loading && visibleOrders.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-400">
          No orders found for this filter.
        </p>
      )}

      {!loading && visibleOrders.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60">
          <div className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1.4fr] gap-4 border-b border-zinc-900 px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
            <span>Customer</span>
          </div>
          <div>
            {visibleOrders.map((order) => {
              const dateLabel = order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "—";
              const total = (order.total_cents / 100).toFixed(2);
              const shippingName = order.shipping_address?.full_name ?? "—";
              const nextStatuses = NEXT_STEPS[order.status] ?? [];

              return (
                <div
                  key={order.id}
                  className="border-t border-zinc-900 px-4 py-3 text-sm text-zinc-200"
                >
                  <div className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1.4fr] gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-zinc-300">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Payment: {order.payment_status}
                      </span>
                    </div>

                    <span className="text-xs text-zinc-400">{dateLabel}</span>

                    <span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </span>

                    <span className="text-sm text-zinc-100">
                      {total}{" "}
                      <span className="text-xs text-zinc-500">
                        {order.currency_code}
                      </span>
                    </span>

                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-200">
                        {shippingName}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {order.customer_email ?? "No email"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300"
                  >
                    View details
                  </button>

                  {nextStatuses.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      {nextStatuses.map((st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => changeStatus(order.id, st)}
                          className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300 disabled:opacity-50"
                        >
                          Set as {STATUS_LABELS[st]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
