import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { Collection, Product } from "@/types/types";
import CollectionPageClient from "./CollectionPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://danicandles.com";

interface ProductWithCollection extends Product {
  collection_id: string | null;
}

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

async function getCollection(slug: string): Promise<Collection | null> {
  const { data, error } = await supabaseServer
    .from("collections")
    .select("id, name, slug, description, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching collection:", error);
    return null;
  }

  return data as Collection | null;
}

async function getCollectionProducts(
  collectionId: string
): Promise<ProductWithCollection[]> {
  const { data, error } = await supabaseServer
    .from("products")
    .select(
      "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url, created_at, collection_id"
    )
    .eq("collection_id", collectionId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data as ProductWithCollection[]) || [];
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    return {
      title: "Collection Not Found | Dani Candles",
      description: "The requested collection could not be found.",
    };
  }

  const description =
    collection.description ||
    `Shop our ${collection.name} collection of handcrafted soy candles at Dani Candles.`;

  return {
    title: `${collection.name} Collection | Dani Candles`,
    description: description.slice(0, 160),
    keywords: [
      collection.name,
      "soy candles",
      "handcrafted candles",
      "Dani Candles",
      "candle collection",
      "home fragrance",
    ],
    openGraph: {
      title: `${collection.name} Collection | Dani Candles`,
      description: description.slice(0, 160),
      url: `${SITE_URL}/collections/${collection.slug}`,
      siteName: "Dani Candles",
      type: "website",
      images: collection.image_url
        ? [
            {
              url: collection.image_url,
              width: 1200,
              height: 630,
              alt: collection.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.name} Collection | Dani Candles`,
      description: description.slice(0, 160),
      images: collection.image_url ? [collection.image_url] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/collections/${collection.slug}`,
    },
  };
}

function generateCollectionSchema(
  collection: Collection,
  products: ProductWithCollection[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.name} Collection`,
    description:
      collection.description ||
      `Shop our ${collection.name} collection of handcrafted soy candles.`,
    url: `${SITE_URL}/collections/${collection.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Dani Candles",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          url: `${SITE_URL}/product/${product.slug}`,
          image: product.image_url,
          offers: {
            "@type": "Offer",
            price: (product.price_cents / 100).toFixed(2),
            priceCurrency: product.currency_code,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };
}

function generateBreadcrumbSchema(collection: Collection) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${SITE_URL}/collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.name,
        item: `${SITE_URL}/collections/${collection.slug}`,
      },
    ],
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  const products = await getCollectionProducts(collection.id);

  const collectionSchema = generateCollectionSchema(collection, products);
  const breadcrumbSchema = generateBreadcrumbSchema(collection);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <CollectionPageClient collection={collection} products={products} />
    </>
  );
}
