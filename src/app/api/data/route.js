import { connectDB } from "@/lib/mongodb";
import Data from "@/models/Data";

// GET ALL
export async function GET() {
  await connectDB();
  const data = await Data.find();
  return Response.json(data);
}

// CREATE
export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const newData = await Data.create(body);

  return Response.json(newData);
}

// UPDATE
export async function PUT(req) {
  await connectDB();
  const { id, ...update } = await req.json();

  const updated = await Data.findByIdAndUpdate(id, update, {
    new: true,
  });

  return Response.json(updated);
}

// DELETE
export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();

  await Data.findByIdAndDelete(id);

  return Response.json({ message: "Deleted Successfully" });
}