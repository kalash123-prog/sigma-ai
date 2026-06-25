 import express from "express";
import generateImage from "../Utils/ImageAi.js";
 import ImageThread from "../models/imageThread.js";


const router = express.Router();

router.get("/images", async (req, res) => {
  try {
    const images = await ImageThread.find()
      .sort({ createdAt: -1 });

    return res.json(images);

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message
    });
  }
});

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await generateImage(prompt);

    const image = await ImageThread.create({
      prompt,
      imageUrl: result.imageUrl,
    });

    return res.json({
      success: true,
      image,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;