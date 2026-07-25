import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, size, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i._id === product._id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...product, size, quantity }];
    });
  };

  const removeItem = (id, size) => {
    setItems(prev => prev.filter(i => !(i._id === id && i.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return removeItem(id, size);
    setItems(prev =>
      prev.map(i =>
        i._id === id && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
