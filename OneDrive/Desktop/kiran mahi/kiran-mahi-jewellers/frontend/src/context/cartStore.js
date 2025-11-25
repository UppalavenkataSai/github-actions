import create from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  setItems: (items) => {
    const total = items.reduce((sum, item) => sum + (item.priceAtAddTime * item.quantity), 0);
    set({ items, total });
  },

  addItem: (item) => {
    const items = [...get().items];
    const existingItem = items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }

    const total = items.reduce((sum, i) => sum + (i.priceAtAddTime * i.quantity), 0);
    set({ items, total });
  },

  removeItem: (itemId) => {
    const items = get().items.filter((i) => i.id !== itemId);
    const total = items.reduce((sum, i) => sum + (i.priceAtAddTime * i.quantity), 0);
    set({ items, total });
  },

  updateQuantity: (itemId, quantity) => {
    const items = get().items.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    const total = items.reduce((sum, i) => sum + (i.priceAtAddTime * i.quantity), 0);
    set({ items, total });
  },

  clearCart: () => set({ items: [], total: 0 }),
}));

export default useCartStore;
