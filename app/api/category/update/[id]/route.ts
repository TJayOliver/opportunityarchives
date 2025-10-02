import { NextResponse } from "next/server";
import { categoryModel, CategoryInterface } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const { categoryname } = await req.json();
    const content = { id: id, categoryname: categoryname };
    await categoryToDatabase(content);
    return NextResponse.json({ status: 201, message: "Success" });
  } catch (error: unknown) {
    console.error("PUT category/update/id", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const categoryToDatabase = async (content: CategoryInterface) => {
  try {
    const id = content.id;
    await categoryModel.updateOne({ id: id }, content);
  } catch (error: unknown) {
    throw error;
  }
};
