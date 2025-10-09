"use server";
import { connectMongoDB } from "@/lib/mongodb";
import { sendValidationCode } from "@/lib/sendMail";
import { deleteSession } from "@/lib/session";
import {
  allowedEmailModel,
  VerificationCodeInterface,
  verificationCodeModel,
} from "@/schema/mongoSchema";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

interface signInInterface {
  email: string;
  error: string;
  access: boolean;
}

export const signIn = async (
  prevState: signInInterface | undefined,
  formData: FormData
): Promise<signInInterface | undefined> => {
  try {
    await connectMongoDB();
    const email = formData.get("email") as string;
    const checkValidity = await checkEmailExistence(email);
    if (checkValidity) {
      const code = nanoid(8);
      await sendValidationCode(email, code);
      const details: VerificationCodeInterface = { email, code };
      await verificationEmailandCodeToDatabase(details);
      redirect("/dashboard");
      return { email, error: "", access: true };
    }
    return { email, error: "Access Denied", access: false };
  } catch (error: unknown) {
    console.error("sign in", error);
    return { email: "", error: "Internal Server Error", access: false };
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

const verificationEmailandCodeToDatabase = async (
  details: VerificationCodeInterface
) => {
  try {
    await verificationCodeModel.create(details);
  } catch (error: unknown) {
    throw error;
  }
};

export const logOut = async () => {
  await deleteSession();
  redirect("/admin");
};
