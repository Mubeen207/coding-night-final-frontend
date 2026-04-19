import { save } from "@/lib/users";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { name, email, password, role, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      otp,
      purpose: "signup",
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const validRoles = ["Need Help", "Can Help", "Both"];
    const userRole = validRoles.includes(role) ? role : "Both";

    const result = await save(name, normalizedEmail, password, userRole);

    return NextResponse.json(
      { message: result.message, status: result.status || 200 }
    );
  } catch (err) {
    console.log("SIGNUP ERROR:", err.message);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
