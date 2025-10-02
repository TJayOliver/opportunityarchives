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
      id: id,
      scholarshipname: scholarshipname,
      deadline: deadline,
      description: description,
      post: post,
      featured: featured,
      scholarshiptype: scholarshiptype,
      programs: programs,
      website: website,
      scholarshipcategory: scholarshipcategory,
      country: country,
      author: author,
    };
    const scholarship = await scholarshipToDatabase(details);
    return NextResponse.json({ status: 201, message: "Success", scholarship });
  } catch (error: unknown) {
    console.error("UPDATE scholarship/update/id", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const scholarshipToDatabase = async (content: ScholarshipInterface) => {
  try {
    const id = content.id;
    const scholarship = await scholarshipModel.updateOne({ id: id }, content);
    return scholarship;
  } catch (error) {
    throw error;
  }
};
