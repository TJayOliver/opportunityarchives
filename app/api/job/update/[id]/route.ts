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
      id,
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
    };
    const job = await updateJobService(details);
    return NextResponse.json({ status: 201, message: "Success", job });
  } catch (error: unknown) {
    console.error("UPDATE job/update/id", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const updateJobService = async (details: Update) => {
  try {
    const content = {
      id: details.id,
      overview: details.overview,
      salary: details.salary,
      featured: details.featured,
      company: details.company,
      website: details.website,
      duration: details.duration,
      position: details.position,
      location: details.location,
      post: details.post,
      jobcategory: details.jobcategory,
    };
    const job = await jobToDatabase(content);
    return job;
  } catch (error: unknown) {
    console.error("SERVICE job/update/id", error);
    throw error;
  }
};

const jobToDatabase = async (content: Update) => {
  try {
    const id = content.id;
    const job = await jobModel.updateOne({ id: id }, content);
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
