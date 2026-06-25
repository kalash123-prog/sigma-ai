import { useState,useEffect } from "react";
import "./imagegen.css";
import { useContext } from "react";
import Mycontext from "./Mycontext";

function ImageGen() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setmode } = useContext(Mycontext);
  const [history, setHistory] = useState([]);
  

 const generateImage = async () => {
 const response = await fetch(
  "http://localhost:3000/api/generate-image",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  }
);

const data = await response.json();

setImage(data.image.imageUrl);
};
useEffect(() => {
  fetch("http://localhost:3000/api/images")
    .then(res => res.json())
    .then(data => setHistory(data));
}, []);

  return (
    <div className="image-page">
      <h1>AI Image Generator</h1>

      <input
        type="text"
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generateImage}>
        Generate Image
      </button>

      {loading && <h3>Generating...</h3>}

     
{image && (
  <img
    src={image}
    alt="generated"
    className="generated-image"
  />
)}
      <button
  className="back-btn"
  onClick={() => setmode("chat")}
>
  ← Back to Chat
</button>
    </div>
    
    
  );
}

export default ImageGen;