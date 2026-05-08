import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Robot } from '@/mocks/robots';

export interface CartItem {
  robot: Robot;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (robot: Robot) => void;
  removeItem: (robotId: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('aiearners_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aiearners_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((robot: Robot) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.robot.id === robot.id);
      if (existing) {
        return prev.map((i) =>
          i.robot.id === robot.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { robot, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((robotId: number) => {
    setItems((prev) => prev.filter((i) => i.robot.id !== robotId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.robot.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, total, count, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}