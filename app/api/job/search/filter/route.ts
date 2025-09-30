import { FilterQuery } from "mongoose";
import { NextResponse } from "next/server";
import { JobInterface, jobModel } from "@/schema/mongoSchema";

type Filters = {
  duration: string;
  jobcategory: string;
};

export async function POST(req: Request) {
  try {
    const { duration, jobcategory } = await req.json();
    const filters = { duration, jobcategory };
    const job = await retrieveFromDatabase(filters);
    return NextResponse.json({ status: 201, data: job });
  } catch (error: unknown) {
    console.error("job/search/filter", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (filters: Filters) => {
  try {
    const query: FilterQuery<JobInterface> = {};

    // Apply filters only if they exist in the request
    if (filters.duration && filters.duration.length > 0) {
      query.duration = { $in: filters.duration }; // Matches any of the selected types
    }
    if (filters.jobcategory && filters.jobcategory.length > 0) {
      query.jobcategory = { $in: filters.jobcategory }; // Matches any of the selected categories
    }
    const job = await jobModel.find(query).sort({ createdAt: -1 }).exec();
    return job;
  } catch (error: unknown) {
    console.error("job/search/filter:RETRIEVE", error);
    throw error;
  }
};
