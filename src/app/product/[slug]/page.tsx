import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { ProductWithCollection } from "@/types/types";
import ProductPageClient from "./ProductPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://danicandles.com";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<ProductWithCollection | null> {
  const { data, error } = await supabaseServer
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      short_description,
      description,
      price_cents,
      currency_code,
      image_url,
      collection_id,
      collections!products_collection_id_fkey (
        id,
        name,
        slug
      )
    `
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as ProductWithCollection | null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Dani Candles",
      description: "The requested product could not be found.",
    };
  }

  const price = (product.price_cents / 100).toFixed(2);
  const description =
    product.short_description ||
    product.description ||
    `${product.name} - Handcrafted soy candle from Dani Candles. $${price} ${product.currency_code}`;

  return {
    title: `${product.name} | Handcrafted Soy Candle | Dani Candles`,
    description: description.slice(0, 160),
    keywords: [
      product.name,
      "soy candle",
      "handcrafted candle",
      "Dani Candles",
      product.collections?.name || "candles",
      "home fragrance",
      "luxury candle",
    ],
    openGraph: {
      title: `${product.name} | Dani Candles`,
      description: description.slice(0, 160),
      url: `${SITE_URL}/product/${product.slug}`,
      siteName: "Dani Candles",
      type: "website",
      images: product.image_url
        ? [
            {
              url: product.image_url,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Dani Candles`,
      description: description.slice(0, 160),
      images: product.image_url ? [product.image_url] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/product/${product.slug}`,
    },
  };
}

function generateProductSchema(product: ProductWithCollection) {
  const price = (product.price_cents / 100).toFixed(2);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.short_description || "",
    image: product.image_url || `${SITE_URL}/og-image.jpg`,
    url: `${SITE_URL}/product/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Dani Candles",
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: product.currency_code,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Dani Candles",
      },
    },
    category: product.collections?.name || "Candles",
    material: "Soy Wax",
  };
}

function generateBreadcrumbSchema(product: ProductWithCollection) {
  const items = [
    { position: 1, name: "Home", item: SITE_URL },
    { position: 2, name: "Shop", item: `${SITE_URL}/shop` },
  ];

  if (product.collections) {
    items.push({
      position: 3,
      name: product.collections.name,
      item: `${SITE_URL}/collections/${product.collections.slug}`,
    });
    items.push({
      position: 4,
      name: product.name,
      item: `${SITE_URL}/product/${product.slug}`,
    });
  } else {
    items.push({
      position: 3,
      name: product.name,
      item: `${SITE_URL}/product/${product.slug}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
