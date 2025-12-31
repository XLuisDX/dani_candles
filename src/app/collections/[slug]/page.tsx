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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-dc-caramel sm:h-2.5 sm:w-2.5"
          />
          <p className="text-xs font-medium text-dc-ink/70 sm:text-sm">
            Loading collection...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-red-500/20 bg-red-50/50 px-4 py-4 text-xs font-medium text-red-700 sm:rounded-2xl sm:px-6 sm:py-5 sm:text-sm"
        >
          {error ?? "Collection not found."}
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 mt-0">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full bg-dc-sand blur-3xl sm:right-12 sm:h-48 sm:w-48 md:right-16 md:h-56 md:w-56"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-dc-caramel blur-3xl sm:left-12 sm:h-56 sm:w-56 md:h-64 md:w-64"
      />

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-12 md:mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
            Collection
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
        >
          {collection.name}
        </motion.h1>

        {collection.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-3 max-w-2xl text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base"
          >
            {collection.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-5 sm:mt-6"
        >
          <Link
            href="/collections"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-dc-sand px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-lg transition-all duration-200 hover:bg-dc-caramel hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:h-12 sm:px-8 sm:text-[10px]"
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
          className="rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-6 text-center backdrop-blur-sm sm:rounded-2xl sm:px-6 sm:py-8"
        >
          <p className="text-xs font-medium text-dc-ink/70 sm:text-sm">
            No products in this collection yet.
          </p>
          <Link
            href="/shop"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-dc-caramel px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow sm:mt-4 sm:px-6 sm:py-3 sm:text-[10px]"
          >
            Browse all products
          </Link>
        </motion.div>
      ) : (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:gap-8"
        >
          {products.map((product) => (
            <motion.article
              key={product.id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-dc-ink/8 bg-white/90 p-3 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg sm:rounded-2xl sm:p-4 md:rounded-3xl md:p-5"
            >
              <div className="relative mb-3 overflow-hidden rounded-lg border border-dc-ink/5 bg-dc-sand/20 sm:mb-4 sm:rounded-xl md:mb-5 md:rounded-2xl">
                <Link href={`/product/${product.slug}`}>
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
                      <div className="flex h-full w-full items-center justify-center text-[8px] font-semibold uppercase tracking-[0.25em] text-dc-ink/30 sm:text-[10px] md:text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {product.is_featured && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute left-2 top-2 rounded-full border border-dc-caramel/30 bg-white/95 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[8px] md:left-4 md:top-4 md:px-4 md:py-1.5 md:text-[9px]"
                  >
                    Featured
                  </motion.span>
                )}
              </div>

              <h2 className="line-clamp-1 font-display text-sm font-semibold text-dc-ink sm:text-base md:text-xl lg:text-2xl">
                <Link
                  href={`/product/${product.slug}`}
                  className="outline-none transition-colors hover:text-dc-caramel focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
                >
                  {product.name}
                </Link>
              </h2>

              {product.short_description && (
                <p className="mt-1.5 hidden text-xs leading-relaxed text-dc-ink/60 sm:line-clamp-2 sm:mt-2 md:mt-3 md:text-sm">
                  {product.short_description}
                </p>
              )}

              <div className="mt-2.5 flex flex-col gap-2 border-t border-dc-ink/5 pt-2.5 sm:mt-3 sm:flex-row sm:items-end sm:justify-between sm:pt-3 md:mt-4 md:pt-4 lg:mt-5 lg:pt-5">
                <p className="text-sm font-bold text-dc-ink sm:text-base md:text-lg">
                  {(product.price_cents / 100).toFixed(2)}{" "}
                  <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 sm:text-[9px] md:text-[10px]">
                    {product.currency_code}
                  </span>
                </p>

                <Link
                  href={`/product/${product.slug}`}
                  className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel sm:inline-block sm:text-[10px]"
                >
                  View Details →
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart(product)}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-dc-caramel px-4 py-2 text-[8px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-[9px] md:mt-6 md:px-6 md:py-3 md:text-[10px]"
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
