import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const request = await Request.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Check if user is already a helper
    const helperIndex = request.helpers.indexOf(currentUser._id);
    if (helperIndex === -1) {
      // Add as helper
      request.helpers.push(currentUser._id);
      await request.save();

      // Create notification for requester
      await Notification.create({
        userId: request.requester,
        message: `${currentUser.name} offered help on "${request.title}"`,
        type: "Match"
      });

      return NextResponse.json({ message: "Added as helper", success: true });
    } else {
      // Remove as helper
      request.helpers.splice(helperIndex, 1);
      await request.save();
      return NextResponse.json({ message: "Removed as helper", success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
