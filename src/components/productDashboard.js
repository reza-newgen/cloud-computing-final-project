import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setUserToken(token);
    }
    fetchProducts(); // 🔥 Call API on page load
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://9ds5geou26.execute-api.us-east-1.amazonaws.com/dev/api-v1-product"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    setUserToken("");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛍️ Product Catalog</h2>

      {/* 🔐 User Status */}
      <div style={{ marginBottom: "20px" }}>
        {userToken ? (
          <div>
            <p>✅ You are logged in!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <p>
              Already a member? <Link to="/login">Login here</Link>
            </p>
            <p>
              Want To Add Product? <Link to="/add-product">Add Product</Link>
            </p>
          </>
        )}
      </div>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {/* 🔄 Loading Indicator */}
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{product.name}</h3>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            <p>{product.description}</p>
            <p>
              <strong>${product.price}</strong>
            </p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductList;
