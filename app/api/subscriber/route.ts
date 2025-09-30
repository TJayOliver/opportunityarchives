import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { subscribersModel } from "@/schema/mongoSchema";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const subscriber = await retrieveSubscribers();
    return NextResponse.json({ status: 201, data: subscriber });
  } catch (error: unknown) {
    console.error("GET subscriber/", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const retrieveSubscribers = async () => {
  try {
    const subscriber = await subscribersModel.find();
    return subscriber;
  } catch (error: unknown) {
    throw error;
  }
};
