import { NextResponse } from "next/server";
import { mailMessagesModel } from "@/schema/mongoSchema";

export async function DELETE(req: Request) {
  try {
    await deleteFromDatabase();
    return NextResponse.json({ status: 201, message: "Success" });
  } catch (error: unknown) {
    console.error("DELETE subscriber/delete", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const deleteFromDatabase = async () => {
  try {
    await mailMessagesModel.deleteMany({});
  } catch (error) {
    throw error;
  }
};
