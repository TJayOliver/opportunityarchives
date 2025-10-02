import { NextResponse } from "next/server";
import { jobModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ jobcategory: string }>;
}

export async function GET(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { jobcategory } = await params;
    const job = await retrieveFromDatabase(jobcategory);
    if (job.length === 0)
      return NextResponse.json({
        status: 404,
        message: `No Data Available for ${jobcategory}`,
      });

    return NextResponse.json({ status: 201, data: job });
  } catch (error: unknown) {
    console.error("GET job/category/jobcategory", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (jobcategory: string) => {
  try {
    const job = await jobModel.find({ jobcategory: jobcategory });
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
