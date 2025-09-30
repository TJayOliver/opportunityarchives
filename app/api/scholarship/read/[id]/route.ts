import { NextResponse } from "next/server";
import { scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const scholarship = await retrieveFromDatabase(id);
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("GET scholarship/read/id", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (id: string) => {
  try {
    const scholarship = await scholarshipModel.findOne({ id: id });
    return scholarship;
  } catch (error) {
    throw error;
  }
};
