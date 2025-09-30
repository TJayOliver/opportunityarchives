import { NextResponse } from "next/server";
import { scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const scholarship = await countScholarships();
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("GET scholarship/count", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const countScholarships = async () => {
  try {
    const scholarship: Number = await scholarshipModel.countDocuments();
    return scholarship;
  } catch (error: unknown) {
    throw error;
  }
};
