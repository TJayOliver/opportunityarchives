import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { mailMessagesModel } from "@/schema/mongoSchema";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const message = await retrieveMessage();
    return NextResponse.json({ status: 200, data: message });
  } catch (error: unknown) {
    console.error("GET subscriber/message", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const retrieveMessage = async () => {
  try {
    const message = await mailMessagesModel.find();
    return message;
  } catch (error: unknown) {
    throw error;
  }
};
