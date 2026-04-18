import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Need Help", "Can Help", "Both"], default: "Both" },
    location: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    trustScore: { type: Number, default: 100 },
    contributions: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);