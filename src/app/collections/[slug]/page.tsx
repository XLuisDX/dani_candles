"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-toastify";
import { Collection, Product } from "@/types/types";

interface ProductWithCollection extends Product {
  collection_id: string | null;
}

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<ProductWithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      setLoading(true);
      setError(null);

      const { data: collectionData, error: collectionError } = await supabase
        .from("collections")
        .select("id, name, slug, description, image_url, is_featured")
        .eq("slug", slug)
        .maybeSingle();

      if (collectionError || !collectionData) {
        console.error(collectionError);
        setError("Collection not found.");
        setLoading(false);
        return;
      }

      setCollection(collectionData);

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(
          "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url, collection_id"
        )
        .eq("active", true)
        .eq("collection_id", collectionData.id)
        .order("created_at", { ascending: false });

      if (productsError) {
        console.error(productsError);
        setError("Something went wrong loading the products.");
      } else {
        setProducts(productsData as ProductWithCollection[]);
      }

      setLoading(false);
    };

    if (slug) {
      fetchCollectionAndProducts();
    }
  }, [slug]);

  const handleAddToCart = (product: ProductWithCollection) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: 1,
      imageUrl: product.image_url,
    });

    toast.success(`${product.name} added to cart!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
            Loading collection...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error ?? "Collection not found."}
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:py-12 lg:px-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-16 h-56 w-56 rounded-full bg-dc-sand blur-3xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-12 h-64 w-64 rounded-full bg-dc-caramel blur-3xl"
      />

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
            Collection
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl lg:text-7xl"
        >
          {collection.name}
        </motion.h1>

        {collection.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-dc-ink/60"
          >
            {collection.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6"
        >
          <Link
            href="/collections"
            className="inline-flex h-12 items-center justify-center rounded-full bg-dc-sand px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-lg transition-all duration-200 hover:bg-dc-caramel hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span>←</span>
            <span>Back to all collections</span>
          </Link>
        </motion.div>
      </motion.section>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-8 text-center backdrop-blur-sm"
        >
          <p className="text-sm font-medium text-dc-ink/70">
            No products in this collection yet.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-dc-caramel px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow"
          >
            Browse all products
          </Link>
        </motion.div>
      ) : (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <motion.article
              key={product.id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative mb-5 overflow-hidden rounded-2xl border border-dc-ink/5 bg-dc-sand/20">
                <div className="aspect-square">
                  {product.image_url ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.25em] text-dc-ink/30">
                      No Image
                    </div>
                  )}
                </div>

                {product.is_featured && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute left-4 top-4 rounded-full border border-dc-caramel/30 bg-white/95 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm backdrop-blur-sm"
                  >
                    Featured
                  </motion.span>
                )}
              </div>

              <h2 className="line-clamp-1 font-display text-2xl font-semibold text-dc-ink">
                <Link
                  href={`/product/${product.slug}`}
                  className="outline-none transition-colors hover:text-dc-caramel focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
                >
                  {product.name}
                </Link>
              </h2>

              {product.short_description && (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-dc-ink/60">
                  {product.short_description}
                </p>
              )}

              <div className="mt-5 flex items-end justify-between border-t border-dc-ink/5 pt-5">
                <p className="text-lg font-bold text-dc-ink">
                  {(product.price_cents / 100).toFixed(2)}{" "}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                    {product.currency_code}
                  </span>
                </p>

                <Link
                  href={`/product/${product.slug}`}
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel"
                >
                  View Details →
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart(product)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-dc-caramel px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
              >
                Add to Cart
              </motion.button>
            </motion.article>
          ))}
        </motion.section>
      )}
    </main>
  );
}