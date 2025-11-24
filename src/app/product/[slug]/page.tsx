'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useCartStore } from '@/store/cartStore'

interface ProductDetail {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  price_cents: number
  currency_code: string
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('products')
        .select(
          'id, name, slug, short_description, description, price_cents, currency_code'
        )
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle()

      if (error) {
        console.error(error)
        setError('Unable to load this candle.')
      } else {
        setProduct(data as ProductDetail | null)
      }

      setLoading(false)
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: 1,
    })
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-zinc-400">Loading candle...</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-red-400">{error ?? 'Candle not found.'}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Imagen / galería (placeholder por ahora) */}
        <div className="flex flex-col gap-4">
          <div className="flex aspect-square items-center justify-center rounded-3xl bg-zinc-900">
            <span className="text-sm text-zinc-500">
              Product image coming soon
            </span>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {product.name}
          </h1>
          {product.short_description && (
            <p className="mt-2 text-sm text-zinc-400">
              {product.short_description}
            </p>
          )}

          <p className="mt-4 text-xl font-semibold text-zinc-50">
            {(product.price_cents / 100).toFixed(2)}{' '}
            <span className="text-xs font-normal text-zinc-400">
              {product.currency_code}
            </span>
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-full bg-amber-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-amber-400 md:w-auto"
          >
            Add to cart
          </button>

          {product.description && (
            <div className="mt-8 space-y-3 text-sm text-zinc-300">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Description
              </h2>
              <p className="leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
