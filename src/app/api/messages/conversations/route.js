import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all unique conversations
    const messages = await Message.find({
      $or: [
        { sender: currentUser._id },
        { receiver: currentUser._id }
      ]
    })
    .populate("sender", "name")
    .populate("receiver", "name")
    .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversations = [];
    const seen = new Set();

    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === currentUser._id.toString()
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();

      if (!seen.has(partnerId)) {
        seen.add(partnerId);
        const partner = msg.sender._id.toString() === currentUser._id.toString()
          ? msg.receiver
          : msg.sender;

        conversations.push({
          partner: partner,
          lastMessage: msg,
          unread: msg.receiver._id.toString() === currentUser._id.toString() && !msg.isRead
        });
      }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
