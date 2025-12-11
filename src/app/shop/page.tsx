"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url"
        )
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Something went wrong loading the products.");
      } else {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: 1,
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Shop
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Awaken your space with handcrafted candles by Dani.
        </p>
      </section>

      {loading && <p className="text-zinc-400">Loading candles...</p>}

      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-zinc-400">No products available yet.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-sm transition hover:-translate-y-1 hover:border-zinc-600 hover:shadow-lg"
            >
              <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500">
                {product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="mb-3 h-56 w-full rounded-2xl object-cover"
                  />
                )}
              </div>

              <h2 className="line-clamp-1 text-lg font-medium text-white">
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
              </h2>

              {product.short_description && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                  {product.short_description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <p className="text-base font-semibold text-zinc-100">
                  {(product.price_cents / 100).toFixed(2)}{" "}
                  <span className="text-xs font-normal text-zinc-400">
                    {product.currency_code}
                  </span>
                </p>

                {product.is_featured && (
                  <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-xs text-amber-300">
                    Featured
                  </span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-amber-400"
              >
                Add to cart
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
