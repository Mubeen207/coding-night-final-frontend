import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Request from "@/models/Request";

export async function GET() {
  try {
    await connectDB();

    const [usersCount, requestsCount, solvedCount] = await Promise.all([
      User.countDocuments(),
      Request.countDocuments(),
      Request.countDocuments({ status: 'Solved' })
    ]);

    return NextResponse.json({
      members: usersCount,
      requests: requestsCount,
      solved: solvedCount
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
