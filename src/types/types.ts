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

export interface UserInfo {
  id: string;
  email: string | undefined;
  fullName: string | undefined;
}

export interface AccountOrder {
  id: string;
  placed_at: string | null;
  status: string;
  total_cents: number;
  currency_code: string;
}

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  total_cents: number;
  currency_code: string;
  placed_at: string | null;
  status: string;
  shipping_address: ShippingAddress;
}

export interface AdminOrderDetail {
  id: string;
  created_at: string | null;
  status: OrderStatus;
  payment_status: string;
  total_cents: number;
  currency_code: string;
  customer_email: string | null;
  shipping_address: ShippingAddress | null;
}

export interface AdminOrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  total_cents: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "refunded";

export interface AdminProduct {
  id: string;
  name: string;
  price_cents: number;
  currency_code: string;
  active: boolean;
  short_description: string | null;
  description: string | null;
  collection_id: string | null;
  image_url: string | null;
  created_at: string | null;
}

export interface CurrentUser {
  id: string;
  email: string | null;
}

export interface ShippingForm {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price_cents: number;
  currency_code: string;
  image_url: string | null;
}

export interface ProductWithCollection extends ProductDetail {
  collection_id: string | null;
  collections?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
}

export interface ProductFormValues {
  name: string;
  price: string;
  currencyCode: string;
  active: boolean;
  shortDescription: string;
  description: string;
  collection_id: string;
}

export interface ProductFormProps {
  initialValues?: ProductFormValues;
  mode: "create" | "edit";
  onSubmit: (
    values: ProductFormValues,
    imageFile: File | null
  ) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
  currentImageUrl?: string | null;
}

export interface OrderItemEmail {
  name: string;
  quantity: number;
  unitPriceFormatted: string;
  lineTotalFormatted: string;
}

export interface OrderConfirmationEmailProps {
  orderId: string;
  totalFormatted: string;
  currencyCode: string;
  customerName: string;
  items: OrderItemEmail[];
  shippingAddress: ShippingAddress;
}

export interface OrderShippedItemEmail {
  name: string;
  quantity: number;
  lineTotalFormatted: string;
}

export interface OrderShippedEmailProps {
  orderId: string;
  trackingNote?: string;
  totalFormatted: string;
  currencyCode: string;
  customerName: string;
  items: OrderShippedItemEmail[];
  shippingAddress: ShippingAddress;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  currencyCode: string;
  quantity: number;
  imageUrl?: string | null;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: () => number;
}