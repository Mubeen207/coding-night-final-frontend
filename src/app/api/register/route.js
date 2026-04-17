import { save } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { name, email, password } = await req.json();
    const result = await save(name, email, password);

    return NextResponse.json(
      { message: result.message, status: result.status },
      {
        status: result.status || 200,
      },
    );
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}