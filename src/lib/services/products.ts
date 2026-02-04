import { createClient } from "@/lib/supabase/client";
import { Product, ProductWithCollection, ProductDetail } from "@/types/types";

export interface ProductFilters {
  collectionId?: string;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
  active?: boolean;
}

export interface ProductsResponse {
  data: Product[] | null;
  error: Error | null;
  count: number;
}

/**
 * Fetch all active products with optional filters
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(
        "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url, collection_id",
        { count: "exact" }
      )
      .eq("active", filters.active ?? true)
      .order("created_at", { ascending: false });

    if (filters.collectionId) {
      query = query.eq("collection_id", filters.collectionId);
    }

    if (filters.featured !== undefined) {
      query = query.eq("is_featured", filters.featured);
    }

    if (filters.priceMin !== undefined) {
      query = query.gte("price_cents", filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      query = query.lte("price_cents", filters.priceMax);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as Product[],
      error: null,
      count: count || 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch products"),
      count: 0,
    };
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(
  slug: string
): Promise<{ data: ProductWithCollection | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
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

    if (error) throw error;

    return {
      data: data as ProductWithCollection | null,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch product"),
    };
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(
  limit: number = 4
): Promise<{ data: Product[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url"
      )
      .eq("active", true)
      .eq("is_featured", true)
      .limit(limit);

    if (error) throw error;

    return { data: data as Product[], error: null };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch featured products"),
    };
  }
}

/**
 * Search products by name or description
 */
export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<{ data: Product[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url"
      )
      .eq("active", true)
      .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;

    return { data: data as Product[], error: null };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to search products"),
    };
  }
}

/**
 * Get related products (same collection or random)
 */
export async function getRelatedProducts(
  currentProductId: string,
  collectionId: string | null,
  limit: number = 4
): Promise<{ data: Product[] | null; error: Error | null }> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(
        "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url"
      )
      .eq("active", true)
      .neq("id", currentProductId)
      .limit(limit);

    if (collectionId) {
      query = query.eq("collection_id", collectionId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // If no products found in collection, get random products
    if ((!data || data.length === 0) && collectionId) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("products")
        .select(
          "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url"
        )
        .eq("active", true)
        .neq("id", currentProductId)
        .limit(limit);

      if (fallbackError) throw fallbackError;
      return { data: fallbackData as Product[], error: null };
    }

    return { data: data as Product[], error: null };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch related products"),
    };
  }
}
