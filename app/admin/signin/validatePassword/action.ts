"use server";
import { connectMongoDB } from "@/lib/mongodb";
import { createSession } from "@/lib/session";
import { verificationCodeModel, adminModel } from "@/schema/mongoSchema";

interface ValidatePasswordInterface {
  code: string;
  error: string;
  success: boolean;
}

export const validatePassword = async (
  prevState: ValidatePasswordInterface | undefined,
  formData: FormData
): Promise<ValidatePasswordInterface | undefined> => {
  try {
    await connectMongoDB();
    const code = formData.get("code") as string;
    const checkValidity = await checkVerificationCodeExistence(code);
    if (!checkValidity) {
      return { code, error: "Access Denied", success: false };
    }
    const email = checkValidity.email;
    const retrieveUsername = await retrieveAdminUsernameByEmail(email);
    await createSession(retrieveUsername);
    return { code: "", error: "", success: true };
  } catch (error: unknown) {
    console.error("sign in", error);
    return { code: "", error: "Internal Server Error", success: false };
  }
};

const checkVerificationCodeExistence = async (Code: string) => {
  try {
    const code = await verificationCodeModel.findOne({
      code: Code,
    });
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
