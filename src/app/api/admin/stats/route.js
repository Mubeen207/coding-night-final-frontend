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

    const [totalUsers, totalRequests, activeRequests, solvedRequests] = await Promise.all([
      User.countDocuments(),
      Request.countDocuments(),
      Request.countDocuments({ status: "Open" }),
      Request.countDocuments({ status: "Solved" })
    ]);

    return NextResponse.json({
      totalUsers,
      totalRequests,
      activeRequests,
      solvedRequests
    });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
