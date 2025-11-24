'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
}

interface Order {
  id: string
  total_cents: number
  currency_code: string
  placed_at: string | null
  status: string
  shipping_address: ShippingAddress
}

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  total_cents: number
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      setError(null)

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, total_cents, currency_code, placed_at, status, shipping_address')
        .eq('id', orderId)
        .maybeSingle()

      if (orderError || !orderData) {
        setError('Order not found.')
        setLoading(false)
        return
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('id, product_name, quantity, total_cents')
        .eq('order_id', orderId)

      if (itemsError) {
        setError('Could not load order items.')
        setLoading(false)
        return
      }

      setOrder(orderData as Order)
      setItems(itemsData as OrderItem[])
      setLoading(false)
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-zinc-400">Loading your order...</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-red-400">{error ?? 'Order not found.'}</p>
      </main>
    )
  }

  const totalFormatted = (order.total_cents / 100).toFixed(2)
  const shippingName = order.shipping_address?.full_name

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Thank you for your order
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Your order <span className="font-mono text-zinc-200">{order.id}</span>{' '}
        has been placed. We&apos;ll email you when it ships.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="space-y-3 rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5 text-sm text-zinc-200">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Order details
          </h2>

          {shippingName && (
            <p>
              <span className="text-zinc-400">Ship to: </span>
              {shippingName}
            </p>
          )}

          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="text-zinc-100">{item.product_name}</p>
                  <p className="text-xs text-zinc-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-zinc-100">
                  {(item.total_cents / 100).toFixed(2)}{' '}
                  <span className="text-xs text-zinc-500">
                    {order.currency_code}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5 text-sm text-zinc-100">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Summary
          </h2>

          <div className="mt-4 flex items-center justify-between">
            <span>Total</span>
            <span>
              {totalFormatted}{' '}
              <span className="text-xs text-zinc-500">
                {order.currency_code}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="mt-6 w-full rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-300"
          >
            Continue shopping
          </button>
        </aside>
      </div>
    </main>
  )
}
