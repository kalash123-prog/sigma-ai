import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  message: {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const threadSchema = new mongoose.Schema({
  thread_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "New chat",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Messages: [messageSchema],
}, 
// Mongoose's built-in way to handle Created_at and Updated_at automatically!
{ 
  timestamps: { createdAt: 'Created_at', updatedAt: 'Updated_at' } 
});

export default mongoose.model("Thread", threadSchema);