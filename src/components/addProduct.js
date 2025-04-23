/// src/components/addProduct.js

import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !name || !price || !description) {
      setMessage("Please give proper information for all properties");
      return;
    }

    try {
      const filename = encodeURIComponent(file.name);
      const contentType = file.type;

      // Send POST request to get pre-signed URL
      const response = await axios.post(
        "https://9ds5geou26.execute-api.us-east-1.amazonaws.com/dev/product",
        {
          filename,
          contentType,
          name,
          description,
          price,
        }
      );

      const { uploadURL } = response.data;

      // Upload the file to S3
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });

      setMessage("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add Product Here</h2>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <button onClick={handleUpload} style={{ padding: "10px 20px" }}>
          Upload
        </button>
      </div>

      {message && (
        <p
          style={{
            background: "#f8f8f8",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
