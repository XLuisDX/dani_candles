import { createClient } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabaseServer";
import { Order, OrderItem, ShippingAddress, OrderStatus } from "@/types/types";

export interface CreateOrderData {
  userId?: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPriceCents: number;
  }[];
  subtotalCents: number;
  shippingCents?: number;
  taxCents?: number;
  totalCents: number;
  currencyCode: string;
}

/**
 * Create a new order (client-side)
 */
export async function createOrder(data: CreateOrderData): Promise<{
  orderId: string | null;
  error: Error | null;
}> {
  try {
    // Create the order
    const supabase = createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: data.userId || null,
        customer_email: data.customerEmail,
        status: "pending" as OrderStatus,
        payment_status: "pending",
        subtotal_cents: data.subtotalCents,
        shipping_cents: data.shippingCents || 0,
        tax_cents: data.taxCents || 0,
        total_cents: data.totalCents,
        currency_code: data.currencyCode,
        shipping_address: data.shippingAddress,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price_cents: item.unitPriceCents,
      total_cents: item.unitPriceCents * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { orderId: order.id, error: null };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      orderId: null,
      error: error instanceof Error ? error : new Error("Failed to create order"),
    };
  }
}

/**
 * Get orders for a user
 */
export async function getUserOrders(userId: string): Promise<{
  data: Order[] | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, total_cents, currency_code, created_at, status, shipping_address"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      data: data?.map((order) => ({
        ...order,
        placed_at: order.created_at,
      })) as Order[],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to fetch orders"),
    };
  }
}

/**
 * Get order by ID with items
 */
export async function getOrderById(orderId: string): Promise<{
  order: Order | null;
  items: OrderItem[] | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_cents, currency_code, created_at, status, shipping_address")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return { order: null, items: null, error: null };

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("id, product_name, quantity, total_cents")
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    return {
      order: { ...order, placed_at: order.created_at } as Order,
      items: items as OrderItem[],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      order: null,
      items: null,
      error: error instanceof Error ? error : new Error("Failed to fetch order"),
    };
  }
}

/**
 * Update order status (server-side only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabaseServer
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Failed to update order status"),
    };
  }
}
