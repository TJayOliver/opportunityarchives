import { NextResponse } from "next/server";
import { scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { filter } = await req.json();
    const scholarship = await retrieveFromDatabase(filter);
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("POST scholarship/search/entity", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (filter: string) => {
  try {
    const scholarship = await scholarshipModel.find({
      $or: [
        { scholarshipname: { $regex: filter, $options: "i" } },
        { country: { $regex: filter, $options: "i" } },
      ],
    });
    return scholarship;
  } catch (error: unknown) {
    throw error;
  }
};
