
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-exports";
import LoginForm from "./components/login";
import ProductDashboard from "./components/productDashboard";
import AddProduct from "./components/addProduct";
import CartPage from "./components/cart";
import OrderPage from "./components/OrderPage";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductDashboard addToCart={addToCart} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;