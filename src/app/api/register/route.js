import { save } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }
console.log(email , password , name);
console.log("done 1");

const result = await save(name, email, password);
console.log(result);

    return NextResponse.json(
      { message: result.message , status: result.status || 200 }
    );
  } catch (err) {
    console.log("SIGNUP ERROR:", err.message);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}