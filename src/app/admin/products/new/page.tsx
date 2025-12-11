"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";
import { ProductForm, ProductFormValues } from "@/components/admin/ProductForm";
import { slugify } from "@/lib/slugify";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }
      const email = data.user.email ?? null;
      if (!isAdminEmail(email)) {
        router.push("/");
        return;
      }
    };
    checkAdmin();
  }, [router]);

  const handleSubmit = async (
    values: ProductFormValues,
    imageFile: File | null
  ) => {
    setSubmitting(true);
    setError(null);

    try {
      const priceNumber = parseFloat(values.price);
      if (isNaN(priceNumber) || priceNumber < 0) {
        setError("Price must be a valid positive number.");
        setSubmitting(false);
        return;
      }

      const priceCents = Math.round(priceNumber * 100);

      let categoryIdValue: string | null = null;
      const trimmedCategoryId = values.categoryId.trim();

      if (trimmedCategoryId !== "") {
        const uuidRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(trimmedCategoryId)) {
          setError("Category ID must be a valid UUID or empty.");
          setSubmitting(false);
          return;
        }
        categoryIdValue = trimmedCategoryId;
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          name: values.name,
          slug: slugify(values.name),
          price_cents: priceCents,
          currency_code: values.currencyCode,
          active: values.active,
          short_description:
            values.shortDescription.trim() === ""
              ? null
              : values.shortDescription.trim(),
          description:
            values.description.trim() === "" ? null : values.description.trim(),
          category_id: categoryIdValue,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error(error);
        setError("Could not create product.");
        return;
      }

      const productId = data.id as string;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("productId", productId);

        try {
          const res = await fetch("/api/admin/upload-product-image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            console.error("Upload product image failed:", await res.text());
          }
        } catch (err) {
          console.error("Error calling upload-product-image:", err);
        }
      }

      router.push("/admin/products");
    } finally {
      setSubmitting(false);
    }
  };

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
  );
}
