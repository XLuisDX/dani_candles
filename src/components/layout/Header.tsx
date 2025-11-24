'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!error && data.session) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
      setCheckingSession(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="border-b border-zinc-900 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-black">
            D
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.18em] text-zinc-100 uppercase">
              Dani Candles
            </span>
            <span className="text-[10px] text-zinc-400">
              Awaken to ambiance
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link href="/shop" className="hover:text-amber-300">
            Shop
          </Link>
          <Link href="/collections" className="hover:text-amber-300">
            Collections
          </Link>
          <Link href="/fragrances" className="hover:text-amber-300">
            Fragrances
          </Link>
          <Link href="/candle-care" className="hover:text-amber-300">
            Candle Care
          </Link>
          <Link href="/about" className="hover:text-amber-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-amber-300">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/cart"
            className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300"
          >
            Cart
          </Link>

          {!checkingSession && (
            <>
              {!isLoggedIn ? (
                <Link
                  href="/auth/login"
                  className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-black hover:bg-amber-300"
                >
                  Sign in
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="text-xs text-zinc-300 hover:text-amber-300"
                  >
                    My account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-amber-400 hover:text-amber-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
