import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  // ─── ADDED FOR EMAIL VERIFICATION ───
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  // ────────────────────────────────────
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// FIX: If Node wraps the package in an object, this unwraps it to get the raw function
const pluginFunction = passportLocalMongoose.default || passportLocalMongoose;

userSchema.plugin(pluginFunction);

export default mongoose.model("User", userSchema);