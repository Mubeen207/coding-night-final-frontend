import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["Match", "Status", "Reputation", "Insight", "Request", "Help", "Chat"], required: true },
    isRead: { type: Boolean, default: false },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    relatedRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', default: null },
    helpStatus: { type: String, enum: ["pending", "accepted", "rejected"], default: null },
    actionRequired: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
