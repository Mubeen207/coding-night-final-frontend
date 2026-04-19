import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Request from "@/models/Request";
import { getServerSession } from "next-auth/next";

async function verifyAdmin(req) {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET(req) {
  try {
    const session = await verifyAdmin(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    await connectDB();

    const limit = 20;

    const recentUsers = await User.find({}, { name: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(limit);

    const recentRequests = await Request.find({}, { title: 1, status: 1, createdAt: 1 })
      .populate("requester", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    const activities = [];

    recentUsers.forEach(user => {
      activities.push({
        type: "user_signup",
        message: `New user "${user.name}" signed up`,
        timestamp: user.createdAt,
        user: { name: user.name }
      });
    });

    recentRequests.forEach(request => {
      activities.push({
        type: "request_created",
        message: `New request "${request.title}" created`,
        timestamp: request.createdAt,
        request: { title: request.title, requester: request.requester?.name }
      });

      if (request.status === "Solved") {
        activities.push({
          type: "request_solved",
          message: `Request "${request.title}" was marked as solved`,
          timestamp: request.createdAt,
          request: { title: request.title, requester: request.requester?.name }
        });
      }
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json(activities.slice(0, limit));
  } catch (error) {
    console.error("Admin activity GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
