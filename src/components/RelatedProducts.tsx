"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FragranceSelectorModal } from "@/components/FragranceSelectorModal";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  currency_code: string;
  image_url: string | null;
}

interface RelatedProductsProps {
  currentProductId: string;
  collectionId?: string | null;
  limit?: number;
}

export function RelatedProducts({
  currentProductId,
  collectionId,
  limit = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState<RelatedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);

      try {
        // First try to fetch products from the same collection
        let url = `/api/products?limit=${limit}`;
        if (collectionId) {
          url += `&collection=${collectionId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.products) {
          // Filter out current product
          let relatedProducts = data.products.filter(
            (p: RelatedProduct) => p.id !== currentProductId
          );

          // If no products in collection or not enough, fetch any products
          if (relatedProducts.length === 0 && collectionId) {
            const fallbackResponse = await fetch(`/api/products?limit=${limit}`);
            const fallbackData = await fallbackResponse.json();
            if (fallbackResponse.ok && fallbackData.products) {
              relatedProducts = fallbackData.products.filter(
                (p: RelatedProduct) => p.id !== currentProductId
              );
            }
          }

          setProducts(relatedProducts.slice(0, limit));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
        setProducts([]);
      }

      setLoading(false);
    };

    fetchRelatedProducts();
  }, [currentProductId, collectionId, limit]);

  const handleAddToCart = (product: RelatedProduct) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="mt-16 sm:mt-20">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 dark:text-white/50 sm:text-xs">
          You might also like
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-dc-ink/8 bg-white/90 p-3 dark:border-white/10 dark:bg-[#1a1a1a]/90"
            >
              <div className="aspect-square rounded-lg bg-dc-ink/10 dark:bg-white/10" />
              <div className="mt-3 h-4 w-3/4 rounded bg-dc-ink/10 dark:bg-white/10" />
              <div className="mt-2 h-4 w-1/2 rounded bg-dc-ink/10 dark:bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16 sm:mt-20"
    >
      <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 dark:text-white/50 sm:text-xs">
        You might also like
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {products.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-dc-ink/8 bg-white/90 p-3 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md dark:border-white/10 dark:bg-[#1a1a1a]/90 sm:rounded-2xl sm:p-4"
          >
            <Link
              href={`/product/${product.slug}`}
              className="relative mb-3 overflow-hidden rounded-lg border border-dc-ink/5 bg-dc-sand/20 dark:border-white/5 dark:bg-white/5"
            >
              <div className="aspect-square">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[8px] font-semibold uppercase tracking-wider text-dc-ink/30 dark:text-white/30">
                    No Image
                  </div>
                )}
              </div>
            </Link>

            <Link
              href={`/product/${product.slug}`}
              className="line-clamp-1 font-display text-sm font-semibold text-dc-ink transition-colors hover:text-dc-caramel dark:text-white dark:hover:text-dc-sand sm:text-base"
            >
              {product.name}
            </Link>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-bold text-dc-ink dark:text-white">
                ${(product.price_cents / 100).toFixed(2)}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(product)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-dc-caramel text-white shadow-sm transition-colors hover:bg-dc-clay"
                aria-label={`Add ${product.name} to cart`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      <FragranceSelectorModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  );
}
