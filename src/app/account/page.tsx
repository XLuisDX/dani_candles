'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface UserInfo {
  id: string
  email: string | undefined
  fullName: string | undefined
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.push('/auth/login')
        return
      }

      const u = data.user
      setUser({
        id: u.id,
        email: u.email ?? undefined,
        fullName:
          (u.user_metadata?.full_name as string | undefined) ?? undefined,
      })

      setLoading(false)
    }

    loadUser()
  }, [router])

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-zinc-400">Loading your account...</p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        My account
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Welcome back{user.fullName ? `, ${user.fullName}` : ''}.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">
            Account details
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            Email:{' '}
            <span className="text-zinc-200">
              {user.email ?? 'Not available'}
            </span>
          </p>
          {user.fullName && (
            <p className="mt-1 text-xs text-zinc-500">
              Name:{' '}
              <span className="text-zinc-200">
                {user.fullName}
              </span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">
            Orders & addresses
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            View your recent orders and saved shipping details.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push('/account/orders')}
              className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-black transition hover:bg-amber-300"
            >
              View order history
            </button>
            <button
              type="button"
              onClick={() => router.push('/account/addresses')}
              className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-200 hover:border-amber-400 hover:text-amber-300"
            >
              Manage addresses (soon)
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
