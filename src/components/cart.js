// src/components/CartPage.js

import React from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage({ cartItems }) {
  const navigate = useNavigate();
  const subtotal = cartItems
    .reduce((sum, item) => sum + parseFloat(item.price), 0)
    .toFixed(2);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p>
                <strong>Price:</strong> ${item.price}
              </p>
            </div>
          ))}

          <h3>Subtotal: ${subtotal}</h3>

          <button
            onClick={() => navigate("/order", { state: { cartItems } })}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
            Proceed to Order
          </button>
        </div>
      )}
    </div>
  );
}