import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id: requestId } = await params;
    const userId = session.user.id;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const request = await Request.findById(requestId).populate("requester", "name");
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.requester._id.toString() === userId) {
      return NextResponse.json({ error: "Cannot help your own request" }, { status: 400 });
    }

    // Ensure helpOffers array exists
    if (!request.helpOffers) {
      request.helpOffers = [];
    }

    const existingOffer = request.helpOffers.find(
      (offer) => offer.helperId.toString() === userId
    );
    if (existingOffer) {
      return NextResponse.json({ error: "Already offered help" }, { status: 400 });
    }

    request.helpOffers.push({
      helperId: userId,
      status: "pending",
      offeredAt: new Date()
    });
    await request.save();

    const notification = await Notification.create({
      userId: request.requester._id,
      senderId: userId,
      message: `${currentUser.name} wants to help you with your request "${request.title}"`,
      type: "Help",
      relatedRequestId: requestId,
      helpStatus: "pending",
      actionRequired: true
    });

    return NextResponse.json({
      success: true,
      message: "Help offer sent",
      notification
    });
  } catch (error) {
    console.error("Help offer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
