import { createClient } from "@/lib/supabase/client";
import { Collection, Product } from "@/types/types";

/**
 * Fetch all collections
 */
export async function getCollections(): Promise<{
  data: Collection[] | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collections")
      .select("id, name, slug, description, image_url, is_featured")
      .order("name");

    if (error) throw error;

    return { data: data as Collection[], error: null };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch collections"),
    };
  }
}

/**
 * Fetch a collection by slug with its products
 */
export async function getCollectionBySlug(slug: string): Promise<{
  collection: Collection | null;
  products: Product[] | null;
  error: Error | null;
}> {
  try {
    // Fetch collection
    const supabase = createClient();
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("id, name, slug, description, image_url, is_featured")
      .eq("slug", slug)
      .maybeSingle();

    if (collectionError) throw collectionError;
    if (!collection) {
      return { collection: null, products: null, error: null };
    }

    // Fetch products in collection
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url"
      )
      .eq("collection_id", collection.id)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (productsError) throw productsError;

    return {
      collection: collection as Collection,
      products: products as Product[],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return {
      collection: null,
      products: null,
      error: error instanceof Error ? error : new Error("Failed to fetch collection"),
    };
  }
}

/**
 * Fetch featured collections
 */
export async function getFeaturedCollections(
  limit: number = 4
): Promise<{ data: Collection[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collections")
      .select("id, name, slug, description, image_url, is_featured")
      .eq("is_featured", true)
      .limit(limit);

    if (error) throw error;

    return { data: data as Collection[], error: null };
  } catch (error) {
    console.error("Error fetching featured collections:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch featured collections"),
    };
  }
}
