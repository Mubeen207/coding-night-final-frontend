import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Request from "@/models/Request";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { requestId, content } = await req.json();
    const userId = session.user.id;

    if (!requestId || !content?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isParticipant = (
      request.requester.toString() === userId ||
      request.assignedHelper?.toString() === userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Only chat participants can send messages" }, { status: 403 });
    }

    let chat = await Chat.findOne({ requestId });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const message = {
      senderId: userId,
      content: content.trim(),
      isRead: false,
      createdAt: new Date()
    };

    // Ensure messages array exists
    if (!chat.messages) {
      chat.messages = [];
    }

    chat.messages.push(message);
    await chat.save();

    // Ensure participants array exists
    if (!chat.participants) {
      chat.participants = [];
    }

    const otherParticipant = chat.participants.find(
      (p) => p.toString() !== userId
    );

    if (otherParticipant) {
      await Notification.create({
        userId: otherParticipant,
        senderId: userId,
        message: `New message from ${session.user.name}`,
        type: "Chat",
        relatedRequestId: requestId
      });
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate("messages.senderId", "name");

    const newMessage = populatedChat.messages[populatedChat.messages.length - 1];

    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}