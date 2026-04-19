import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["Open", "Solved"], default: "Open" },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
