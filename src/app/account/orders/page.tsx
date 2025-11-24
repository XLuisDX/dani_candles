'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface AccountOrder {
  id: string
  placed_at: string | null
  status: string
  total_cents: number
  currency_code: string
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError(null)

      // 1) Verificar usuario
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        router.push('/auth/login')
        return
      }

      const userId = userData.user.id

      // 2) Buscar órdenes de ese usuario
      const { data, error } = await supabase
        .from('orders')
        .select('id, placed_at, status, total_cents, currency_code')
        .eq('user_id', userId)
        .order('placed_at', { ascending: false })

      if (error) {
        console.error(error)
        setError('Could not load your orders.')
      } else {
        setOrders(data as AccountOrder[])
      }

      setLoading(false)
    }

    loadOrders()
  }, [router])

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'paid':
        return 'Paid'
      case 'shipped':
        return 'Shipped'
      case 'canceled':
        return 'Canceled'
      case 'refunded':
        return 'Refunded'
      default:
        return status
    }
  }

  const statusColorClasses = (status: string) => {
    switch (status) {
      case 'paid':
        return 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
      case 'shipped':
        return 'border-sky-500/40 text-sky-300 bg-sky-500/10'
      case 'canceled':
        return 'border-red-500/40 text-red-300 bg-red-500/10'
      case 'refunded':
        return 'border-purple-500/40 text-purple-300 bg-purple-500/10'
      default:
        return 'border-amber-500/40 text-amber-300 bg-amber-500/10'
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Order history
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Review your past Dani Candles orders.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-zinc-400">
          Loading your orders...
        </p>
      )}

      {error && (
        <p className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-zinc-900 bg-zinc-950/70 p-6">
          <p className="text-sm text-zinc-400">
            You haven&apos;t placed any orders yet.
          </p>
          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="mt-3 rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-black transition hover:bg-amber-300"
          >
            Start shopping
          </button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-zinc-900 px-4 py-3 text-xs text-zinc-500">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>
          <div>
            {orders.map((order) => {
              const dateLabel = order.placed_at
                ? new Date(order.placed_at).toLocaleDateString()
                : '—'
              const total = (order.total_cents / 100).toFixed(2)

              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() =>
                    router.push(`/order/confirmation/${order.id}`)
                  }
                  className="grid w-full grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-t border-zinc-900 px-4 py-3 text-left text-sm text-zinc-200 transition hover:bg-zinc-900/60"
                >
                  <span className="font-mono text-xs text-zinc-300">
                    {order.id}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {dateLabel}
                  </span>
                  <span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${statusColorClasses(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </span>
                  <span className="text-right text-sm text-zinc-100">
                    {total}{' '}
                    <span className="text-xs text-zinc-500">
                      {order.currency_code}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
