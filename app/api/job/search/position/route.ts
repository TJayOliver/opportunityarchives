import { NextResponse } from "next/server";
import { jobModel } from "@/schema/mongoSchema";

export async function POST(req: Request) {
  try {
    const { position } = await req.json();
    const job = await retrieveFromDatabase(position);
    return NextResponse.json({ status: 201, data: job });
  } catch (error: unknown) {
    console.error("POST job/search/position", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (position: string) => {
  try {
    const jobs = await jobModel.find({
      position: { $regex: position, $options: "i" },
    });
    return jobs;
  } catch (error: unknown) {
    throw error;
  }
};
