import mongoose from "mongoose";

const imageThreadSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "ImageThread",
  imageThreadSchema
);