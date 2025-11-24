import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black/90">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500">
              Dani Candles
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Handcrafted candles to awaken your ambiance.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <Link href="/legal/privacy-policy" className="hover:text-amber-300">
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms-and-conditions"
              className="hover:text-amber-300"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/legal/shipping-and-returns"
              className="hover:text-amber-300"
            >
              Shipping & Returns
            </Link>
          </div>

          <div className="flex gap-3 text-xs text-zinc-500">
            <a
              href="#"
              className="hover:text-amber-300"
              aria-label="Instagram"
            >
              IG
            </a>
            <a href="#" className="hover:text-amber-300" aria-label="TikTok">
              TT
            </a>
            <a href="#" className="hover:text-amber-300" aria-label="Facebook">
              FB
            </a>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-zinc-700">
          © {new Date().getFullYear()} Dani Candles. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
