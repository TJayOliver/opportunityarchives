import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  generateDescription,
  generateJobPosition,
  generatePost,
} from "@/lib/geminiAI";
import { JobInterface, jobModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

type JobInput = Omit<JobInterface, "id" | "position" | "overview">;

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const {
      salary,
      featured,
      company,
      website,
      duration,
      location,
      post,
      author,
      jobcategory,
    } = await req.json();
    const details = {
      salary,
      featured,
      company,
      website,
      duration,
      location,
      post,
      author,
      jobcategory,
    };
    const job = await createJobService(details);
    return NextResponse.json({ status: 201, message: "Success", job });
  } catch (error: unknown) {
    console.error("POST subscriber/notify", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createJobService = async (details: JobInput) => {
  try {
    const website: string = "none";
    const generatedPost = await generatePost("job", details.post);
    const generatedPosition = await generateJobPosition(details.post);
    const generatedDescription = await generateDescription("job", details.post);
    const jobs = {
      id: nanoid(),
      overview: generatedDescription,
      salary: details?.salary || "Negotiable",
      featured: details.featured,
      company: details?.company || "Private Employer",
      website: details.website || website,
      duration: details.duration,
      position: generatedPosition,
      location: details.location,
      post: generatedPost,
      author: details.author,
      jobcategory: details.jobcategory,
    };
    const job = await jobToDatabase(jobs);
    return job;
  } catch (error: unknown) {
    throw error;
  }
};

const jobToDatabase = async (details: JobInterface) => {
  try {
    const job = await jobModel.create(details);
    return job;
  } catch (error: unknown) {
    throw error;
  }
};
