"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { isAdminEmail } from "@/lib/isAdmin"

type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded"

interface ShippingAddress {
  full_name?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

interface AdminOrderDetail {
  id: string
  created_at: string | null
  status: OrderStatus
  payment_status: string
  total_cents: number
  currency_code: string
  customer_email: string | null
  shipping_address: ShippingAddress | null
}

interface AdminOrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price_cents: number
  total_cents: number
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  canceled: "Canceled",
  refunded: "Refunded",
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  paid: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  preparing: "border-sky-500/40 text-sky-300 bg-sky-500/10",
  shipped: "border-sky-500/40 text-sky-300 bg-sky-500/10",
  delivered: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  canceled: "border-red-500/40 text-red-300 bg-red-500/10",
  refunded: "border-purple-500/40 text-purple-300 bg-purple-500/10",
}

const NEXT_STEPS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["paid", "canceled"],
  paid: ["preparing", "shipped", "canceled"],
  preparing: ["shipped", "canceled"],
  shipped: ["delivered"],
}

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<AdminOrderDetail | null>(null)
  const [items, setItems] = useState<AdminOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push("/auth/login")
        return
      }
      const email = data.user.email ?? null
      if (!isAdminEmail(email)) {
        router.push("/")
        return
      }
    }
    checkAdmin()
  }, [router])

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      setError(null)

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
        )
        .eq("id", orderId)
        .single()

      if (orderError || !orderData) {
        console.error(orderError)
        setError("Could not load this order.")
        setLoading(false)
        return
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(
          "id, product_name, quantity, unit_price_cents, total_cents"
        )
        .eq("order_id", orderId)
        .order("created_at", { ascending: true })

      if (itemsError) {
        console.error(itemsError)
        setError("Could not load order items.")
        setItems([])
      } else {
        setItems(itemsData as AdminOrderItem[])
      }

      setOrder(orderData as AdminOrderDetail)
      setLoading(false)
    }

    if (orderId) {
      loadOrder()
    }
  }, [orderId])

const changeStatus = async (newStatus: OrderStatus) => {
  if (!order) return
  setUpdatingStatus(true)
  setError(null)
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id)
      .select(
        "id, created_at, status, payment_status, total_cents, currency_code, customer_email, shipping_address"
      )
      .single()

    if (error || !data) {
      console.error(error)
      setError("Could not update order status.")
    } else {
      setOrder(data as AdminOrderDetail)

      if (newStatus === "shipped") {
        void fetch("/api/admin/order-status-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: order.id }),
        }).catch((err) => {
          console.error(
            "[AdminOrderDetail] Error calling order-status-email:",
            err
          )
        })
      }
    }
  } finally {
    setUpdatingStatus(false)
  }
}


  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-zinc-400">Loading order...</p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-red-400">
          {error ?? "Order not found."}
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="mt-4 rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300"
        >
          Back to orders
        </button>
      </main>
    )
  }

  const createdAtLabel = order.created_at
    ? new Date(order.created_at).toLocaleString()
    : "—"
  const total = (order.total_cents / 100).toFixed(2)
  const shipping = order.shipping_address ?? {}
  const shippingName = shipping.full_name ?? "—"

  const nextStatuses = NEXT_STEPS[order.status] ?? []

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <button
        type="button"
        onClick={() => router.push("/admin/orders")}
        className="text-xs text-zinc-500 hover:text-amber-300"
      >
        ← Back to orders
      </button>

      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Order {order.id}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Placed on {createdAtLabel}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Payment status:{" "}
            <span className="text-zinc-200">
              {order.payment_status}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs ${STATUS_COLORS[order.status]}`}
          >
            {STATUS_LABELS[order.status]}
          </span>

          {nextStatuses.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px]">
              {nextStatuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => changeStatus(st)}
                  className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300 disabled:opacity-50"
                >
                  Set as {STATUS_LABELS[st]}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">
            Items
          </h2>
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">
              No items found for this order.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {items.map((item) => {
                const unit = (item.unit_price_cents / 100).toFixed(2)
                const line = (item.total_cents / 100).toFixed(2)
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-900 bg-zinc-950/80 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm text-zinc-100">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Qty {item.quantity} · {unit}{" "}
                        {order.currency_code} each
                      </p>
                    </div>
                    <p className="text-sm text-zinc-100">
                      {line}{" "}
                      <span className="text-xs text-zinc-500">
                        {order.currency_code}
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
            <h2 className="text-sm font-semibold text-zinc-100">
              Customer & shipping
            </h2>
            <p className="mt-2 text-xs text-zinc-400">
              Name:{" "}
              <span className="text-zinc-200">
                {shippingName}
              </span>
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Email:{" "}
              <span className="text-zinc-200">
                {order.customer_email ?? "—"}
              </span>
            </p>

            <div className="mt-3 text-xs text-zinc-300">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                Address
              </p>
              <p className="mt-1">
                {shipping.line1 || "—"}
                {shipping.line2 ? `, ${shipping.line2}` : ""}
                <br />
                {shipping.city}, {shipping.state}{" "}
                {shipping.postal_code}
                <br />
                {shipping.country}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
            <h2 className="text-sm font-semibold text-zinc-100">
              Summary
            </h2>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-200">
              <span>Total</span>
              <span>
                {total}{" "}
                <span className="text-xs text-zinc-500">
                  {order.currency_code}
                </span>
              </span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">
              Taxes and shipping were calculated at checkout.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}