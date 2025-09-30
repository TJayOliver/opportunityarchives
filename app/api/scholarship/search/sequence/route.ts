import { NextResponse } from "next/server";
import { scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const { filter } = await req.json();
    const scholarship = await retrieveFromDatabase(filter);
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("GET scholarship/search/sequence", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (filter: string) => {
  try {
    const sortOrder = filter === "Recent" ? -1 : 1;
    const scholarships = await scholarshipModel.find().sort({
      datecreated: sortOrder,
    });
    return scholarships;
  } catch (error: unknown) {
    throw error;
  }
};
