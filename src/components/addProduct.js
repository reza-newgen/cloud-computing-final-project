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
    console.log("file size :"+file.size);
      
      // Send POST request to API Gateway
      const response = await axios.post(
        "https://9ds5geou26.execute-api.us-east-1.amazonaws.com/dev/product",
        {
          filename,
          contentType,
          name,
          description,
          price
        }
      );

  

      const { uploadURL } = response.data;
      console.log("ghjghjhjkhjkhkjhkj"+uploadURL, response.data);
      // Upload the file to S3 using the pre-signed URL
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
    <div>
      <h2>Add Product Here</h2>
      <input
        type="text"
        placeholder="enter product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="enter product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="enter product price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default ImageUploader;
