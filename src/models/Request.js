import mongoose from "mongoose";

const helpOfferSchema = new mongoose.Schema({
  helperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  offeredAt: { type: Date, default: Date.now },
  respondedAt: { type: Date, default: null }
}, { _id: true });

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["Open", "In Progress", "Solved"], default: "Open" },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    helpOffers: [helpOfferSchema],
    assignedHelper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: null }
  },
  { timestamps: true }
);

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
