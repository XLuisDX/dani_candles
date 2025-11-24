'use client'

import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Account created. Please check your email to confirm.')
      setTimeout(() => router.push('/shop'), 2000)
    }

    setLoading(false)
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Join Dani Candles and keep track of your orders.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-zinc-400">
            Full name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-zinc-400">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-zinc-400">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {message && (
          <p className="text-sm text-emerald-400">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-300 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-xs text-zinc-400">
        Already have an account?{' '}
        <a
          href="/auth/login"
          className="text-amber-300 hover:text-amber-200"
        >
          Sign in
        </a>
      </p>
    </main>
  )
}
