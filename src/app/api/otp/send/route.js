import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { sendOTP } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimit(ip);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();
    const { email, purpose } = await request.json();

    if (!email || !purpose) {
      return NextResponse.json(
        { error: "Email and purpose are required" },
        { status: 400 }
      );
    }

    if (!["signup", "login"].includes(purpose)) {
      return NextResponse.json(
        { error: "Invalid purpose" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (purpose === "signup") {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
    }

    if (purpose === "login") {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 400 }
        );
      }
    }

    await Otp.deleteMany({ email: normalizedEmail, purpose });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      email: normalizedEmail,
      otp,
      expiresAt,
      purpose,
    });

    try {
      await sendOTP(normalizedEmail, otp, purpose);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      await Otp.deleteOne({ email: normalizedEmail, otp, purpose });
      return NextResponse.json(
        { error: "Failed to send email. Please check your email configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      expiresAt,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
