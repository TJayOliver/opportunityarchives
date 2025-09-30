import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  generateDescription,
  generateScholarshipHeading,
  generateScholarshipLink,
  generatePost,
} from "@/lib/geminiAI";
import { ScholarshipInterface, scholarshipModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

type ScholarshipInput = Omit<
  ScholarshipInterface,
  "id" | "datecreated" | "description" | "scholarshipname"
>;

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const {
      deadline,
      scholarshiptype,
      programs,
      scholarshipcategory,
      country,
      website,
      post,
      featured,
      author,
    } = await req.json();
    const details = {
      deadline,
      scholarshiptype,
      programs,
      scholarshipcategory,
      country,
      website,
      post,
      featured,
      author,
    };
    const scholarship = await createscholarshipService(details);
    return NextResponse.json({ status: 201, message: "Success", scholarship });
  } catch (error: unknown) {
    console.error("POST scholarship/create", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createscholarshipService = async (details: ScholarshipInput) => {
  try {
    const generatedScholarshipName = await generateScholarshipHeading(
      details.post
    );
    const generatedPost = await generatePost("scholarship", details.post);
    const generatedWebsite = await generateScholarshipLink(details.post);
    const generatedDescription = await generateDescription(
      "scholarship",
      details.post
    );
    const scholarships = {
      id: nanoid(),
      scholarshipname: generatedScholarshipName,
      deadline: details.deadline,
      description: generatedDescription,
      post: generatedPost,
      featured: details.featured,
      scholarshiptype: details.scholarshiptype,
      programs: details.programs,
      scholarshipcategory: details.scholarshipcategory,
      country: details.country,
      website: generatedWebsite,
      author: details.author,
    };
    const scholarship = await scholarshipToDatabase(scholarships);
    return scholarship;
  } catch (error: unknown) {
    console.error("SERVICE scholarship/create", error);
    throw error;
  }
};

const scholarshipToDatabase = async (details: ScholarshipInterface) => {
  try {
    const scholarship = await scholarshipModel.create(details);
    return scholarship;
  } catch (error) {
    throw error;
  }
};
