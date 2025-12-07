"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { isAdminEmail } from "@/lib/isAdmin"
import {
  ProductForm,
  ProductFormValues,
} from "@/components/admin/ProductForm"

interface AdminProduct {
  id: string
  name: string
  price_cents: number
  currency_code: string
  active: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
    const loadProduct = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price_cents, currency_code, active")
        .eq("id", productId)
        .single()

      if (error || !data) {
        console.error(error)
        setError("Could not load product.")
        setProduct(null)
      } else {
        setProduct(data as AdminProduct)
      }

      setLoading(false)
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleSubmit = async (values: ProductFormValues) => {
    if (!product) return
    setSubmitting(true)
    setError(null)

    try {
      const priceNumber = parseFloat(values.price)
      if (isNaN(priceNumber) || priceNumber < 0) {
        setError("Price must be a valid positive number.")
        setSubmitting(false)
        return
      }

      const priceCents = Math.round(priceNumber * 100)

      const { data, error } = await supabase
        .from("products")
        .update({
          name: values.name,
          price_cents: priceCents,
          currency_code: values.currencyCode,
          active: values.active,
        })
        .eq("id", product.id)
        .select("id, name, price_cents, currency_code, active")
        .single()

      if (error || !data) {
        console.error(error)
        setError("Could not update product.")
      } else {
        router.push("/admin/products")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-zinc-400">Loading product...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-red-400">
          {error ?? "Product not found."}
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="mt-4 rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300"
        >
          Back to products
        </button>
      </main>
    )
  }

  const initialValues: ProductFormValues = {
    name: product.name,
    price: (product.price_cents / 100).toFixed(2),
    currencyCode: product.currency_code,
    active: product.active,
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <button
        type="button"
        onClick={() => router.push("/admin/products")}
        className="text-xs text-zinc-500 hover:text-amber-300"
      >
        ← Back to products
      </button>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
        Edit product
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Update this product&apos;s information.
      </p>

      <ProductForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </main>
  )
}
