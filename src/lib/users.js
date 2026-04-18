// import bcrypt from "bcryptjs";
import bcrypt from "bcrypt"
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
export async function getUsers() {
   console.log("getUsers done 1");
   const res = await fetch("/api/users");
   console.log("getUsers done 2");
  const data = await res.json();
  console.log(data);
  
  return data;
}

export async function getByEmail(email) {
  const users = await getUsers();

  return users.find((u) => u.email === email);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function save(name, email, password) {
  await connectDB();

  const exists = await User.findOne({ email });

  if (exists) {
    return { status: 400, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return { status: 201, message: "User Created" };
}