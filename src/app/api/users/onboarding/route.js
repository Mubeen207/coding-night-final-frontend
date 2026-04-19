import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";

export async function PUT(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const data = await req.json();

    const email = session.user.email;

    // Parse skills and interests as arrays if they're strings
    const skills = typeof data.skills === 'string'
      ? data.skills.split(',').map(s => s.trim()).filter(s => s)
      : data.skills || [];

    const interests = typeof data.interests === 'string'
      ? data.interests.split(',').map(s => s.trim()).filter(s => s)
      : data.interests || [];

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name: data.name,
        location: data.location,
        skills: skills,
        interests: interests,
        role: data.role || "Both"
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
