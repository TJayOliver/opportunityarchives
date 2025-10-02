import { NextResponse } from "next/server";
import { categoryModel, CategoryInterface } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { categoryname } = await req.json();
    await categoryname.trim();
    await createCategoryService(categoryname);
    return NextResponse.json({ status: 201, message: "Success" });
  } catch (error: unknown) {
    console.error("DELETE category/delete/id", error);
    if (error instanceof Error) {
      return NextResponse.json({ status: 409, message: error.message });
    }
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

const createCategoryService = async (categoryname: string) => {
  try {
    const checkCategory = await categoryModel.findOne({
      categoryname: categoryname,
    });
    if (checkCategory) {
      throw new Error(`${categoryname} Already Exist`);
    }
    const categoryDetails = {
      id: nanoid(),
      categoryname,
    };
    const category = await categoryToDatabase(categoryDetails);
    return category;
  } catch (error: unknown) {
    console.error("SERVICE category/", error);
    throw error;
  }
};

const categoryToDatabase = async (categoryDetails: CategoryInterface) => {
  try {
    await categoryModel.create(categoryDetails);
  } catch (error: unknown) {
    throw error;
  }
};
