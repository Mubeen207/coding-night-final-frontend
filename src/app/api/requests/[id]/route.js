import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { getServerSession } from "next-auth/next";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const request = await Request.findById(id)
      .populate("requester", "name location")
      .populate("helpers", "name skills trustScore badges");

    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const data = await req.json();
    
    const updatedRequest = await Request.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
