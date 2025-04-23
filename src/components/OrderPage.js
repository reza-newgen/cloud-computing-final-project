// src/components/OrderPage.js

import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function OrderPage() {
  const [userInfo, setUserInfo] = useState({ email: "", name: "", userId: "" });
  const [jwtToken, setJwtToken] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await Auth.currentSession();
        const payload = session.getIdToken().decodePayload();

        setJwtToken(session.getIdToken().getJwtToken());

        setUserInfo({
          email: payload.email,
          name: payload.given_name || payload.name || payload["cognito:username"],
          userId: payload.sub, // This is the user's UUID
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUser();
  }, []);

  const subtotal = cartItems
    .reduce((sum, item) => sum + parseFloat(item.price), 0)
    .toFixed(2);

  const handlePlaceOrder = async () => {
    const orderData = {
      email: userInfo.email,
      userId: userInfo.userId,
      items: cartItems.map((item) => ({
        productId: item.id || "prod-default", // update this to match actual structure
        productName: item.name,
        quantity: 1, // hardcoded for now, adjust if quantity selection is supported
        price: parseFloat(item.price),
      })),
      totalAmount: parseFloat(subtotal),
    
    };
    console.log("Payload : "+orderData.email+" "+orderData.userId);

    try {
      const response = await axios.post(
        "https://9ds5geou26.execute-api.us-east-1.amazonaws.com/dev/orders", // ⛳ Replace with actual POST URL
        orderData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMsg("✅ Order placed successfully!");
      console.log("Order response:", response.data);
    } catch (error) {
      console.error("Error placing order:", error);
      setResponseMsg("❌ Failed to place order.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🧾 Order Summary</h2>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>User ID:</strong> {userInfo.userId}</p>
      </div>

      <h3>Items Ordered:</h3>

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "10px 0", marginBottom: "10px" }}>
            <p><strong>{item.name}</strong> - ${item.price}</p>
            <p>{item.description}</p>
          </div>
        ))
      )}

      <h3 style={{ marginTop: "20px" }}>Subtotal: ${subtotal}</h3>

      <button onClick={handlePlaceOrder} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Place Order
      </button>

      {responseMsg && (
        <p style={{ marginTop: "15px", color: responseMsg.includes("✅") ? "green" : "red" }}>
          {responseMsg}
        </p>
      )}
    </div>
  );
}
