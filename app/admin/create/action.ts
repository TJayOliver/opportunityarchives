"use server";
import {
  adminModel,
  AdministratorInterface,
  allowedEmailModel,
} from "@/schema/mongoSchema";
import { connectMongoDB } from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { storeToFirebase } from "@/lib/firebase";

interface createAdminInterface {
  username: string;
  email: string;
  error: string;
}

export const createAdmin = async (
  prevState: createAdminInterface | undefined,
  formData: FormData
): Promise<createAdminInterface | undefined> => {
  try {
    await connectMongoDB();

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const imageFile = formData.get("image") as File;

    const firebase = await storeToFirebase(imageFile);
    const imagename = firebase?.imageName;
    const image = firebase?.imageURL;

    const checkValidity = await checkEmailExistence(email);
    if (!checkValidity) {
      return { username, email, error: "Access Denied" };
    }

    const details: AdministratorInterface = {
      id: nanoid(),
      username,
      email,
      imagename,
      image,
    };
    await adminToDatabase(details);
    return { username: "", email: "", error: "Successfully Created" };
  } catch (error: unknown) {
    console.error("Create Admin", error);
    return { username: "", email: "", error: "Internal Server Error" };
  }
};

const checkEmailExistence = async (Email: string) => {
  try {
    const email = await allowedEmailModel.findOne({ email: Email });
    return email;
  } catch (error) {
    throw error;
  }
};

const adminToDatabase = async (details: AdministratorInterface) => {
  try {
    await adminModel.create(details);
  } catch (error: unknown) {
    throw error;
  }
};
