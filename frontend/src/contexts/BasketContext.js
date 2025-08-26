/* import { useState, createContext, useContext, useEffect } from "react";

const BasketContext = createContext();

const defaultBasket = JSON.parse(localStorage.getItem("basket")) || [];

const BasketProvider = ({ children }) => {
  const [items, setItems] = useState(defaultBasket);

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

  const values = {
    items,
    setItems,
    addToBasket,
    removeFromBasket,
    emptyBasket,
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
      return setItems((items) => [{ ...data, quantity: 1 }, ...items]);
    }

    const filtered = items.filter((item) => item._id !== findBasketItem._id);
    setItems(filtered);
  };

  // Xóa 1 sản phẩm
  const removeFromBasket = (item_id) => {
    const filtered = items.filter((item) => item._id !== item_id);
    setItems(filtered);
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
