import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Request from "@/models/Request";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { requestId } = await params;
    const userId = session.user.id;

    const request = await Request.findById(requestId);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isParticipant = (
      request.requester.toString() === userId ||
      request.assignedHelper?.toString() === userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Not authorized to view this chat" }, { status: 403 });
    }

    const chat = await Chat.findOne({ requestId })
      .populate("participants", "name")
      .populate("messages.senderId", "name");

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}