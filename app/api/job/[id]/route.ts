import { NextResponse } from "next/server";
import { jobModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const job = await retrieveFromDatabase(id);
    return NextResponse.json({ status: 201, data: [job] });
  } catch (error: unknown) {
    console.error("GET job/id", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (id: string) => {
  try {
    const job = await jobModel.findOne({ id: id });
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
