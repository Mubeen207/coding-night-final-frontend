import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate("requester", "name email")
      .populate("helpers", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(query);

    return NextResponse.json({ requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Admin requests GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
