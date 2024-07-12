import React, { useEffect, useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../assetts/default_image.svg";
import AdditionalImages from "./AdditionalImages";

const ImageGenerator = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrl, setImageUrl] = useState(default_image);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const fetchGeneratedImages = async () => {
    if (inputRef.current.value === "") {
      return;
    }
    setLoading(true);
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: inputRef.current.value,
          n: 5,
          size: "1024x1024",
        }),
      }
    );

    const data = await response.json();
    const imageUrls = data.data.map((item) => item.url);
    setImageUrl(imageUrls[0]);
    imageUrls.shift()    
    setImageUrls(imageUrls)
    setLoading(false);
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={imageUrl} alt="Generated" />
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>
            Loading.....
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Want To See"
        />
        <div onClick={fetchGeneratedImages} className="generate-btn">
          Generate
        </div>
      </div>
      {imageUrls.length > 0 && (
        <div className="row">
          <div className="container">
            <div className="image_frame">
              {imageUrls.map((url, index) => (
                <AdditionalImages key={index} url={url} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;