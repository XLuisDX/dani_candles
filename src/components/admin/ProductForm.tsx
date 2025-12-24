"use client";

import { useState } from "react";

export interface ProductFormValues {
  name: string;
  price: string;
  currencyCode: string;
  active: boolean;
  shortDescription: string;
  description: string;
  categoryId: string;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  mode: "create" | "edit";
  onSubmit: (
    values: ProductFormValues,
    imageFile: File | null
  ) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
  currentImageUrl?: string | null;
}

export function ProductForm({
  initialValues,
  mode,
  onSubmit,
  submitting,
  error,
  currentImageUrl,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      price: "",
      currencyCode: "USD",
      active: true,
      shortDescription: "",
      description: "",
      categoryId: "",
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;
    const checked = target instanceof HTMLInputElement ? target.checked : false;
    const type = target instanceof HTMLInputElement ? target.type : "text";

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55">
              Product info
            </p>
            <p className="mt-1 text-sm text-dc-ink/65">
              Core details shown in the shop.
            </p>
          </div>
          <div className="hidden md:block rounded-full border border-black/5 bg-white/60 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-dc-ink/55">
            {mode === "create" ? "Create" : "Edit"}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
              Product name
            </label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10"
              placeholder="Lavender Night, Cozy Vanilla..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
              Short description
            </label>
            <textarea
              name="shortDescription"
              value={values.shortDescription}
              onChange={handleChange}
              rows={2}
              className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10"
              placeholder="One or two lines that describe this candle..."
            />
            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-dc-ink/45">
              Used in product cards. Keep it short and punchy.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
              Full description
            </label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={5}
              className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm leading-relaxed text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10"
              placeholder="Story, scent notes, usage and care..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md md:p-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55">
          Pricing
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
              Price
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/60 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
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
                className="h-11 w-full rounded-2xl border border-black/10 bg-white/70 px-4 text-sm text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10"
                placeholder="24.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
              Currency
            </label>
            <select
              name="currencyCode"
              value={values.currencyCode}
              onChange={handleChange}
              className="mt-2 h-11 w-full rounded-2xl border border-black/10 bg-white/70 px-4 text-sm text-dc-ink outline-none transition focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10"
            >
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md md:p-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55">
          Organization
        </p>

        <div className="mt-5">
          <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
            Category ID (uuid, optional)
          </label>
          <input
            name="categoryId"
            value={values.categoryId}
            onChange={handleChange}
            className="mt-2 h-11 w-full rounded-2xl border border-black/10 bg-white/70 px-4 text-sm text-dc-ink outline-none transition placeholder:text-dc-ink/40 focus:border-dc-caramel/35 focus:bg-white focus:ring-4 focus:ring-dc-caramel/10"
            placeholder="Leave empty or paste a valid category UUID"
          />
          <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-dc-ink/45">
            Leave empty if you don&apos;t have categories yet.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md md:p-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55">
          Media
        </p>

        <div className="mt-5 space-y-3">
          <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
            Product image
          </label>

          <div className="rounded-2xl border border-dc-ink/10 bg-white/60 p-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-dc-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-dc-cream/70 file:px-4 file:py-2 file:text-[11px] file:font-medium file:uppercase file:tracking-[0.18em] file:text-dc-ink/70 hover:file:bg-white"
            />

            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-dc-ink/45">
              JPEG / PNG / WEBP. If you don&apos;t select a file, the current
              image (if any) will be kept.
            </p>

            {currentImageUrl && !imageFile && (
              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/55">
                  Current image
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImageUrl}
                  alt="Current product image"
                  className="mt-3 h-28 w-28 rounded-2xl border border-black/10 object-cover shadow-sm"
                />
              </div>
            )}

            {imageFile && (
              <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-dc-ink/55">
                Selected:{" "}
                <span className="font-medium text-dc-ink/75">
                  {imageFile.name}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-md md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.20em] text-dc-ink/55">
              Visibility
            </p>
            <p className="mt-1 text-sm text-dc-ink/65">
              Control if the product appears in the shop.
            </p>
          </div>

          <label className="inline-flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-dc-ink/60">
              Visible in shop
            </span>
            <span className="relative inline-flex h-7 w-12 items-center rounded-full border border-black/10 bg-white/60 p-1 shadow-sm">
              <input
                type="checkbox"
                name="active"
                checked={values.active}
                onChange={handleChange}
                className="peer sr-only"
              />
              <span className="h-5 w-5 rounded-full bg-dc-ink/70 transition peer-checked:translate-x-5 peer-checked:bg-dc-caramel" />
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-dc-caramel px-6 py-3 text-[11px] font-medium uppercase tracking-[0.20em] text-white shadow-sm transition hover:bg-dc-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/40 disabled:opacity-50"
          >
            {mode === "create" ? "Create product" : "Save changes"}
          </button>
        </div>
      </section>
    </form>
  );
}
