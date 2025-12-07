"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { isAdminEmail } from "@/lib/isAdmin"
import {
  ProductForm,
  ProductFormValues,
} from "@/components/admin/ProductForm"
import { slugify } from "@/lib/slugify"

export default function NewProductPage() {
  const router = useRouter()
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

  const handleSubmit = async (values: ProductFormValues) => {
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
        .insert({
          name: values.name,
          price_cents: priceCents,
          slug: slugify(values.name), 
          currency_code: values.currencyCode,
          active: values.active,
        })
        .select("id")
        .single()

      if (error || !data) {
        console.error(error)
        setError("Could not create product.")
      } else {
        router.push("/admin/products")
      }
    } finally {
      setSubmitting(false)
    }
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
        New product
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Create a new product for the Dani Candles catalog.
      </p>

      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </main>
  )
}
