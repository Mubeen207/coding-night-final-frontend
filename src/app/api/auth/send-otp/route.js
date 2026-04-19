import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OTP from "@/models/Otp";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, type } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    if (type === "signup") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists. Please login." }, { status: 400 });
      }
    } else if (type === "login") {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return NextResponse.json({ message: "No account found with this email. Please sign up." }, { status: 404 });
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 5 minutes expiry
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert the OTP in the DB (delete any existing OTPs for the email first)
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt,
    });

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"HelpHub AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your HelpHub AI Verification Code",
      text: `Your OTP is: ${otpCode}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg">
          <h2 style="color: #333;">HelpHub AI Verification</h2>
          <p>Your one-time passcode is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #0284c7;">${otpCode}</h1>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes. Do not share this code with anyone.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
