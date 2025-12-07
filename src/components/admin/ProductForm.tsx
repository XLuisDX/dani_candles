"use client"

import { useState } from "react"

export interface ProductFormValues {
  name: string
  price: string
  currencyCode: string
  active: boolean
}

interface ProductFormProps {
  initialValues?: ProductFormValues
  mode: "create" | "edit"
  onSubmit: (values: ProductFormValues) => Promise<void>
  submitting?: boolean
  error?: string | null
}

export function ProductForm({
  initialValues,
  mode,
  onSubmit,
  submitting,
  error,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      price: "",
      currencyCode: "USD",
      active: true,
    }
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target
    const { name, value } = target
    const checked = target instanceof HTMLInputElement ? target.checked : false
    const type = target instanceof HTMLInputElement ? target.type : "select"
    
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(values)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5"
    >
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-300">
          Product name
        </label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-amber-400"
          placeholder="Lavender Night, Cozy Vanilla..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Price
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-2 text-xs text-zinc-400">
              $
            </span>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={values.price}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-amber-400"
              placeholder="24.00"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Currency
          </label>
          <select
            name="currencyCode"
            value={values.currencyCode}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
          >
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            name="active"
            checked={values.active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-amber-400"
          />
          <span>Visible in shop</span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full border border-amber-500/60 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-200 hover:border-amber-400 hover:bg-amber-500/20 disabled:opacity-50"
        >
          {mode === "create" ? "Create product" : "Save changes"}
        </button>
      </div>
    </form>
  )
}