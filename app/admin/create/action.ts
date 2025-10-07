"use server";
import { adminModel, AdministratorInterface } from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { storeToFirebase } from "@/lib/firebase";

interface signUp {
  username: string;
  email: string;
  error: string;
}

const emails = ["tjoliver1@yahoo.com", "tjayoliver99@gmail.com"];

export const createAdmin = async (
  prevState: signUp | undefined,
  formData: FormData
): Promise<signUp | undefined> => {
  try {
    await connectMongoDB();

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const imageFile = formData.get("image") as File;

    const firebase = await storeToFirebase(imageFile);
    const imagename = firebase?.imageName;
    const image = firebase?.imageURL;

    if (!emails.includes(email)) {
      return { username, email, error: "Email not valid" };
    }

    const details: AdministratorInterface = {
      id: nanoid(),
      username,
      email,
      imagename,
      image,
    };
    await adminToDatabase(details);
    return { username, email, error: "" };
  } catch (error: unknown) {
    console.error("Create Admin", error);
    return { username: "", email: "", error: "Internal Server Error" };
  }
};

const adminToDatabase = async (details: AdministratorInterface) => {
  try {
    await adminModel.create(details);
  } catch (error: unknown) {
    throw error;
  }
};
