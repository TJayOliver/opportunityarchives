import { NextResponse } from "next/server";
import { scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ scholarshipcategory: string }>;
}

export async function GET(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { scholarshipcategory } = await params;
    const scholarship = await retrieveFromDatabase(scholarshipcategory);
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("GET scholarship/category/id", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (scholarshipcategory: string) => {
  try {
    const scholarship = await scholarshipModel.find({
      scholarshipcategory: scholarshipcategory,
    });
    return scholarship;
  } catch (error: unknown) {
    throw error;
  }
};
