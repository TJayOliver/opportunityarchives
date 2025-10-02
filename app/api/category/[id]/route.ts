import { NextResponse } from "next/server";
import { categoryModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const category = await retrieveFromDatabase(id);
    return NextResponse.json({ status: 201, data: category });
  } catch (error: unknown) {
    console.error("GET category/id", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const retrieveFromDatabase = async (id: string) => {
  try {
    const category = await categoryModel.find({
      id: id,
    });
    return category;
  } catch (error: unknown) {
    throw error;
  }
};
