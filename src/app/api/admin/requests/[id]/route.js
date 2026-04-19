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

export async function DELETE(req, { params }) {
  try {
    const session = await verifyAdmin(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { id } = params;

    const deletedRequest = await Request.findByIdAndDelete(id);
    if (!deletedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Admin request DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await verifyAdmin(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { id } = params;
    const updates = await req.json();

    const allowedUpdates = ["status", "title", "description", "category", "urgency"];
    const filteredUpdates = {};

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      filteredUpdates,
      { new: true }
    ).populate("requester", "name email");

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Admin request PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
