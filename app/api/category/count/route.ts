import { NextResponse } from "next/server";
import { categoryModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectMongoDB();
    const category = await countCategorys();
    return NextResponse.json({ status: 201, data: category });
  } catch (error: unknown) {
    console.error("GET category/count", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const countCategorys = async () => {
  try {
    const category: Number = await categoryModel.countDocuments();
    return category;
  } catch (error: unknown) {
    throw error;
  }
};
