import { NextResponse } from "next/server";
import { jobModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const job = await retrieveFromDatabase(true);
    return NextResponse.json({ status: 201, data: job });
  } catch (error: unknown) {
    console.error("GET job/featured", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export const retrieveFromDatabase = async (value: boolean) => {
  try {
    const job = await jobModel
      .find({ featured: value })
      .limit(8)
      .sort({ datecreated: -1 });
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
