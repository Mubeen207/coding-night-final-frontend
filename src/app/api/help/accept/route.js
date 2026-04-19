import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Chat from "@/models/Chat";
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
    const { requestId, helperId, action } = await req.json();
    const userId = session.user.id;

    if (!requestId || !helperId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.requester.toString() !== userId) {
      return NextResponse.json({ error: "Only request owner can accept help" }, { status: 403 });
    }

    // Ensure helpOffers array exists
    if (!request.helpOffers || request.helpOffers.length === 0) {
      return NextResponse.json({ error: "No help offers found" }, { status: 404 });
    }

    const helpOffer = request.helpOffers.find(
      (offer) => offer.helperId.toString() === helperId
    );
    if (!helpOffer) {
      return NextResponse.json({ error: "Help offer not found" }, { status: 404 });
    }

    if (action === "accept") {
      helpOffer.status = "accepted";
      helpOffer.respondedAt = new Date();
      request.assignedHelper = helperId;
      request.status = "In Progress";

      // Ensure helpers array exists
      if (!request.helpers) {
        request.helpers = [];
      }
      request.helpers.push(helperId);

      const chat = await Chat.create({
        requestId: requestId,
        participants: [userId, helperId],
        messages: []
      });
      request.chatId = chat._id;

      await Notification.create({
        userId: helperId,
        senderId: userId,
        message: `${session.user.name} accepted your help offer for "${request.title}". You can now chat!`,
        type: "Help",
        relatedRequestId: requestId,
        helpStatus: "accepted"
      });

      await Notification.updateMany(
        { userId: userId, relatedRequestId: requestId, type: "Help", helpStatus: "pending" },
        { $set: { helpStatus: "accepted", actionRequired: false } }
      );

      await request.save();

      return NextResponse.json({
        success: true,
        message: "Help accepted, chat created",
        chatId: chat._id
      });
    } else if (action === "reject") {
      helpOffer.status = "rejected";
      helpOffer.respondedAt = new Date();
      await request.save();

      await Notification.create({
        userId: helperId,
        senderId: userId,
        message: `${session.user.name} declined your help offer for "${request.title}"`,
        type: "Help",
        relatedRequestId: requestId,
        helpStatus: "rejected"
      });

      return NextResponse.json({
        success: true,
        message: "Help offer rejected"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Accept help error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}