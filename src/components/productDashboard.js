import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ProductDashboard({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem("jwtToken");
      setJwtToken(token);
    };

    handleTokenChange();
    window.addEventListener("storage", handleTokenChange);
    return () => window.removeEventListener("storage", handleTokenChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setJwtToken("");
    navigate("/login");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://9ds5geou26.execute-api.us-east-1.amazonaws.com/dev/api-v1-product"
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛍️ Product Catalog</h2>

      <div style={{ marginBottom: "20px" }}>
        {jwtToken ? (
          <>
            <p>✅ Logged in</p>
            <p><button onClick={handleLogout}>🔓 Logout</button></p>
            <p><Link to="/add-product">➕ Add Product</Link></p>
            <p><Link to="/cart">🛒 View Cart</Link></p>
          </>
        ) : (
          <p>🔐 <Link to="/login">Login</Link></p>
        )}
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                boxSizing: "border-box",
              }}
            >
              <h3>{product.name}</h3>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
              <p>{product.description}</p>
              <p><strong>${product.price}</strong></p>
              {jwtToken ? (
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              ) : (
                <p style={{ color: "red" }}>🔒 Please login to add to cart</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductDashboard;
