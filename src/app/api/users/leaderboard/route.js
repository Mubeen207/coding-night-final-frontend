import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    // Sort by trust score and then contributions
    const users = await User.find({})
      .sort({ trustScore: -1, contributions: -1 })
      .limit(10)
      .select("name skills trustScore contributions badges");
      
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
