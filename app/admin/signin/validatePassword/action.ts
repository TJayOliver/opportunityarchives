"use server";
import { connectMongoDB } from "@/lib/mongodb";
import { createSession } from "@/lib/session";
import {
  allowedEmailModel,
  verificationCodeModel,
  adminModel,
} from "@/schema/mongoSchema";
import { redirect } from "next/navigation";

interface ValidatePasswordInterface {
  code: string;
  error: string;
}
export const validatePassword = async (
  prevState: ValidatePasswordInterface | undefined,
  formData: FormData
): Promise<ValidatePasswordInterface | undefined> => {
  try {
    await connectMongoDB();
    const code = formData.get("code") as string;
    const checkValidity = await checkVerificationCodeExistence(code);
    if (checkValidity) {
      const email = checkValidity.email;
      const retrieveUsername = await retrieveAdminUsernameByEmail(email);
      createSession(retrieveUsername);
      redirect("/");
    } else {
      return { code, error: "Access Denied" };
    }
  } catch (error: unknown) {
    console.error("sign in", error);
    return { code: "", error: "Internal Server Error" };
  }
};

const checkVerificationCodeExistence = async (Code: string) => {
  try {
    const code = await verificationCodeModel.findOne({
      code: Code,
    });
    console.log("code");
    return code;
  } catch (error: unknown) {
    throw error;
  }
};

const retrieveAdminUsernameByEmail = async (email: string) => {
  try {
    const username = await adminModel.findOne({ email: email });
    return username;
  } catch (error: unknown) {
    throw error;
  }
};
