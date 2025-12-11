export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  price_cents: number;
  currency_code: string;
  is_featured: boolean;
  image_url: string;
}
