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

    // Only requester or admin can mark as solved
    if (request.requester.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Toggle status
    const newStatus = request.status === "Solved" ? "Open" : "Solved";
    request.status = newStatus;
    await request.save();

    // Update trust scores and contributions for helpers if solved
    if (newStatus === "Solved") {
      for (const helperId of request.helpers) {
        await User.findByIdAndUpdate(helperId, {
          $inc: { contributions: 1, trustScore: 5 }
        });

        // Create notification for helper
        await Notification.create({
          userId: helperId,
          message: `"${request.title}" was marked as solved`,
          type: "Status"
        });
      }
    }

    return NextResponse.json({ status: newStatus, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
