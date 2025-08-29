import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
/* import { useState, createContext, useContext, useEffect } from "react";
>>>>>>> ccd808d0554eeb2246d8f0e6e9adae067aae893f

const BasketContext = createContext();

const defaultBasket = JSON.parse(localStorage.getItem("basket")) || [];

const BasketProvider = ({ children }) => {
  const [items, setItems] = useState(defaultBasket);
  const { loggedIn } = useAuth();

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(items));
  }, [items]);

  const addToBasket = (data, findBasketItem) => {
    if (!findBasketItem) {
      return setItems((items) => [data, ...items]);
    }

    const filtered = items.filter((item) => item._id !== findBasketItem._id);
    setItems(filtered);
  };

  const removeFromBasket = (item_id) => {
    const filtered = items.filter((item) => item._id !== item_id);
    setItems(filtered);
  };

  const emptyBasket = () => setItems([]);

  // Kiểm tra xem có cần đăng nhập để checkout không
  const requiresLogin = () => {
    return items.length > 0 && !loggedIn;
  };

  const values = {
    items,
    setItems,
    addToBasket,
    removeFromBasket,
    emptyBasket,
    requiresLogin,
  };

  return (
    <BasketContext.Provider value={values}>{children}</BasketContext.Provider>
  );
};

const useBasket = () => useContext(BasketContext);

export { BasketProvider, useBasket };
 */


import { useState, createContext, useContext, useEffect } from "react";

const BasketContext = createContext();

const defaultBasket = JSON.parse(localStorage.getItem("basket")) || [];

const BasketProvider = ({ children }) => {
  const [items, setItems] = useState(defaultBasket);

  // Lưu giỏ hàng vào localStorage
  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(items));
  }, [items]);

  // Thêm hoặc xóa khỏi giỏ
  const addToBasket = (data, findBasketItem) => {
    if (!findBasketItem) {
      // Thêm mới
      return setItems((items) => [{ ...data, quantity: 1 }, ...items]);
    }

    // Nếu đã tồn tại thì xóa
    setItems((items) => items.filter((item) => item._id !== findBasketItem._id));
  };

  // Xóa 1 sản phẩm
  const removeFromBasket = (item_id) => {
    setItems((items) => items.filter((item) => item._id !== item_id));
  };

  // Xóa toàn bộ giỏ
  const emptyBasket = () => setItems([]);

  // Tăng số lượng
  const increaseQuantity = (item_id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === item_id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng
  const decreaseQuantity = (item_id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === item_id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const values = {
    items,
    setItems,
    addToBasket,
    removeFromBasket,
    emptyBasket,
    increaseQuantity,
    decreaseQuantity,
  };

  return (
    <BasketContext.Provider value={values}>{children}</BasketContext.Provider>
  );
};

const useBasket = () => useContext(BasketContext);

export { BasketProvider, useBasket };
