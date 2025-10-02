import { NextResponse } from "next/server";
import { categoryModel } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";

interface ParamsInterface {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: ParamsInterface) {
  try {
    await connectMongoDB();
    const { id } = await params;
    await deleteFromDatabase(id);
    return NextResponse.json({ status: 201, message: "Success" });
  } catch (error: unknown) {
    console.error("DELETE category/delete/id", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const deleteFromDatabase = async (id: string) => {
  try {
    await categoryModel.deleteOne({
      id: id,
    });
  } catch (error: unknown) {
    throw error;
  }
};
