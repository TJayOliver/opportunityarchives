import { NextResponse } from "next/server";
import { scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const scholarship = await retrieveFromDatabase(true);
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("GET scholarship/featured", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (value: boolean) => {
  try {
    const scholarship = await scholarshipModel
      .find({ featured: value })
      .limit(8)
      .sort({ datecreated: -1 });
    return scholarship;
  } catch (error: unknown) {
    throw error;
  }
};
