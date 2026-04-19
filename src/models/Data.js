import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    title: String,
    email: String,
  },
  { timestamps: true }
);

export default mongoose.models.Data ||
  mongoose.model("Data", dataSchema);