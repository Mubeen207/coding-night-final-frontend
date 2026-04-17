import bcrypt, { compare } from "bcrypt";

export async function getUsers() {
  try {
    const response = await fetch(
      "https://ecommercedb-five.vercel.app/api/users",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data;
  } catch (error) {
    return [];
  }
}

export async function getByEmail(email) {
  const data = await getUsers();
  if (!Array.isArray(data)) return null;

  return data.find((user) => user.email === email);
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}

export async function save(name, email, password) {
  try {
    const found = await getByEmail(email);
    if (found) return { status: 400, message: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 12);
    const response = await fetch(
      "https://ecommercedb-five.vercel.app/api/user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: hashedPassword }),
      },
    );

    if (!response.ok) throw new Error("DB Error");
    return { status: 201, message: "User Created" };
  } catch (error) {
    return { status: 500, message: "Server Error" };
  }
}