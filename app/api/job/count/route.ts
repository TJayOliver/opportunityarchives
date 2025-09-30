import { NextResponse } from "next/server";
import { jobModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const job = await countJobs();
    return NextResponse.json({ status: 201, data: job });
  } catch (error: unknown) {
    console.error("GET job/count", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const countJobs = async () => {
  try {
    const job: Number = await jobModel.countDocuments();
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
