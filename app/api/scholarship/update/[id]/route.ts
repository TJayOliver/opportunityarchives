import { NextResponse } from "next/server";
import { ScholarshipInterface, scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

type Update = Omit<ScholarshipInterface, "id">;

export async function PUT(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const {
      scholarshipname,
      deadline,
      description,
      post,
      featured,
      scholarshiptype,
      programs,
      website,
      scholarshipcategory,
      country,
      author,
    }: Update = await req.json();
    const details = {
      id,
      scholarshipname,
      deadline,
      description,
      post,
      featured,
      scholarshiptype,
      programs,
      website,
      scholarshipcategory,
      country,
      author,
    };
    const scholarship = await updatescholarshipService(details);
    return NextResponse.json({ status: 201, message: "Success", scholarship });
  } catch (error: unknown) {
    console.error("UPDATE scholarship/update/id", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const updatescholarshipService = async (details: ScholarshipInterface) => {
  try {
    const content = {
      id: details.id,
      scholarshipname: details.scholarshipname,
      deadline: details.deadline,
      description: details.description,
      post: details.post,
      featured: details.featured,
      scholarshiptype: details.scholarshiptype,
      programs: details.programs,
      website: details.website,
      scholarshipcategory: details.scholarshipcategory,
      country: details.country,
      author: details.author,
    };
    const scholarship = await scholarshipToDatabase(content);
    return scholarship;
  } catch (error: unknown) {
    console.error("SERVICE scholarship/update/id", error);
    throw error;
  }
};

const scholarshipToDatabase = async (content: ScholarshipInterface) => {
  try {
    const id = content.id;
    const scholarship = await scholarshipModel.updateOne({ id: id }, content);
    return scholarship;
  } catch (error) {
    throw error;
  }
};
