import { NextResponse } from "next/server";
import { jobModel } from "@/schema/mongoSchema";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

type Update = {
  id?: string;
  overview: string;
  salary: string;
  featured: boolean;
  company: string;
  website: string;
  duration: string;
  position: string;
  location: string;
  post: string;
  jobcategory: string;
};

export async function PUT(req: Request, { params }: ParamsInterface) {
  try {
    const { id } = await params;
    const {
      overview,
      salary,
      featured,
      company,
      website,
      duration,
      position,
      location,
      post,
      jobcategory,
    }: Update = await req.json();
    const details = {
      id: id,
      overview: overview,
      salary: salary,
      featured: featured,
      company: company,
      website: website,
      duration: duration,
      position: position,
      location: location,
      post: post,
      jobcategory: jobcategory,
    };
    const job = await jobToDatabase(details);
    return NextResponse.json({ status: 201, message: "Success", job });
  } catch (error: unknown) {
    console.error("UPDATE job/update/id", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const jobToDatabase = async (content: Update) => {
  try {
    const id = content.id;
    const job = await jobModel.updateOne({ id: id }, content);
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
