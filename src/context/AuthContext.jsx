import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Saved authenticated user in localStorage, default null for Guests
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wow_burger_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Guest user by default
  });

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wow_burger_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wow_burger_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Invalid email or password' };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error. Ensure server is running.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wow_burger_user');
  };

  // Cart operations
  const addToCart = (foodItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === foodItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...foodItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => prev.filter((item) => item.id !== foodId));
  };

  const updateQuantity = (foodId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
