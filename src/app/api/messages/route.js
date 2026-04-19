import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "received"; // 'sent' or 'received'

    const userEmail = session.user.email;
    const User = mongoose.models.User || (await import("@/models/User")).default;
    const currentUser = await User.findOne({ email: userEmail });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const query = type === "sent"
      ? { sender: currentUser._id }
      : { receiver: currentUser._id };

    const messages = await Message.find(query)
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await req.json();

    const userEmail = session.user.email;
    const User = mongoose.models.User || (await import("@/models/User")).default;
    const currentUser = await User.findOne({ email: userEmail });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find receiver by name
    const receiver = await User.findOne({ name: data.receiverName });
    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    const newMessage = await Message.create({
      sender: currentUser._id,
      receiver: receiver._id,
      content: data.content,
      requestId: data.requestId || null
    });

    // Populate and return
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name")
      .populate("receiver", "name");

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Import mongoose for the models
import mongoose from "mongoose";
