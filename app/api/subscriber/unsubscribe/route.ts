import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { subscribersModel } from "@/schema/mongoSchema";

export async function DELETE(req: Request) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    await unsubscribeFromDatabase(email);
    return NextResponse.json({ status: 201, message: "Success" });
  } catch (error: unknown) {
    console.error("DELETE subscriber/unsubscribe", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const unsubscribeFromDatabase = async (email: string) => {
  try {
    await subscribersModel.deleteOne({ email: email });
  } catch (error: unknown) {
    throw error;
  }
};
