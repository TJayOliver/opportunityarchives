import { FilterQuery } from "mongoose";
import { NextResponse } from "next/server";
import { ScholarshipInterface, scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

type Filters = {
  scholarshiptype: string;
  programs: string;
  scholarshipcategory: string;
};

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { scholarshiptype, programs, scholarshipcategory } = await req.json();
    const filters = { scholarshiptype, programs, scholarshipcategory };
    const scholarship = await retrieveFromDatabase(filters);
    return NextResponse.json({ status: 201, data: scholarship });
  } catch (error: unknown) {
    console.error("POST scholarship/search/filter", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (filters: Filters) => {
  try {
    const query: FilterQuery<ScholarshipInterface> = {};

    // Apply filters only if they exist in the request
    if (filters.scholarshiptype && filters.scholarshiptype.length > 0) {
      query.scholarshiptype = { $in: filters.scholarshiptype }; // Matches any of the selected types
    }
    if (filters.programs && filters.programs.length > 0) {
      query.programs = { $in: filters.programs }; // Matches any of the selected levels
    }
    if (filters.scholarshipcategory && filters.scholarshipcategory.length > 0) {
      query.scholarshipcategory = { $in: filters.scholarshipcategory }; // Matches any of the selected categories
    }
    const scholarship = await scholarshipModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
    return scholarship;
  } catch (error: unknown) {
    throw error;
  }
};
