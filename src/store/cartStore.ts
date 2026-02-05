import { CartState } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === item.productId && i.fragrance === item.fragrance
        );

        if (existing) {
          const updated = items.map((i) =>
            i.productId === item.productId && i.fragrance === item.fragrance
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, fragrance) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.fragrance === fragrance)
          ),
        });
      },

      updateQuantity: (productId, fragrance, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(
              (i) => !(i.productId === productId && i.fragrance === fragrance)
            ),
          });
          return;
        }

        const updated = get().items.map((i) =>
          i.productId === productId && i.fragrance === fragrance
            ? { ...i, quantity }
            : i
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      totalCents: () =>
        get().items.reduce(
          (acc, item) => acc + item.priceCents * item.quantity,
          0
        ),

      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "dani-candles-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
