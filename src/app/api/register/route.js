import { save } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["Need Help", "Can Help", "Both"];
    const userRole = validRoles.includes(role) ? role : "Both";

    const result = await save(name, email, password, userRole);

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