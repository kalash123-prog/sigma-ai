import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.Gemini_image_API_Key,
});

const generateImage = async (prompt) => {
    try{
 const response = await ai.models.generateImages({
  model: "imagen-4.0-generate-001",
  prompt,
});

    return {
      success: true,
      image: response.generatedImages?.[0]?.image?.imageBytes,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default generateImage;