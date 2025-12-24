import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  currencyCode: string;
  quantity: number;
  imageUrl?: string | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          const updated = items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }

        const updated = get().items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      totalCents: () =>
        get().items.reduce(
          (acc, item) => acc + item.priceCents * item.quantity,
          0
        ),
    }),
    {
      name: "dani-candles-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);