import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");

    let query = {};
    if (category && category !== "All categories") query.category = category;
    if (urgency && urgency !== "All urgency levels") query.urgency = urgency;

    const requests = await Request.find(query)
      .populate("requester", "name location")
      .sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await req.json();
    
    // Add the requester ID explicitly from the session
    let requesterId = session.user.id || session.user._id || data.requesterId;
    
    // Fallback if session doesn't expose ID natively
    if (!requesterId && session.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) requesterId = user._id;
    }
    
    data.requester = requesterId;
    
    const newRequest = await Request.create(data);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
