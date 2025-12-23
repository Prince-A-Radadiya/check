import { createContext, useContext, useEffect, useState, useMemo } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const emptyCart = {
  items: [],
  totalQty: 0,
  totalAmount: 0,
};

export const CartProvider = ({ children }) => {
  // User state from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Reactive cart key based on user
  const cartKey = useMemo(() => (user ? `cart_user_${user.id}` : null), [user]);

  const [cart, setCart] = useState(emptyCart);
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    // Ensure profile has full URL
    if (storedUser.profile && !storedUser.profile.startsWith("http")) {
      storedUser.profile = `http://localhost:9000${storedUser.profile}`;
    }
    setUser(storedUser);
  }
}, []);

  // Sync user across tabs
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);
    syncUser();

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // Load cart when user changes
  useEffect(() => {
    if (cartKey) {
      const saved = localStorage.getItem(cartKey);
      setCart(saved ? JSON.parse(saved) : emptyCart);
    } else {
      setCart(emptyCart);
    }
  }, [cartKey]);

  // Save cart to localStorage
  const saveCart = (newCart) => {
    setCart(newCart);
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(newCart));
    }
  };

  // Add to cart
  const addToCart = (product) => {
    if (!user) {
      alert("Please login to add items");
      return;
    }

    const exists = cart.items.find((i) => i.productId === product.id);

    let items;

    if (exists) {
      items = cart.items.map((i) =>
        i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      items = [
        ...cart.items,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      ];
    }

    calculate(items);
  };

  // Update quantity
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id);

    calculate(
      cart.items.map((i) => (i.productId === id ? { ...i, qty } : i))
    );
  };

  // Remove item
  const removeItem = (id) => {
    calculate(cart.items.filter((i) => i.productId !== id));
  };

  // Calculate totals
  const calculate = (items) => {
    const totalQty = items.reduce((a, b) => a + b.qty, 0);
    const totalAmount = items.reduce((a, b) => a + b.qty * b.price, 0);

    saveCart({ items, totalQty, totalAmount });
  };

  // Logout function (optional)
  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   localStorage.removeItem("cart"); // remove saved cart from localStorage
  setUser(null); // clear user state
  // setCart([]);   // clear cart state
};


  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeItem, user, setUser, logout }}
    >
      {children}
    </CartContext.Provider>
  );
};
