"use server";
import { connectMongoDB } from "@/lib/mongodb";
import { allowedEmailModel } from "@/schema/mongoSchema";

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
    const checkValidity = await checkCodeExistence(code);
    if (checkValidity) {
      return { code, error: "great" };
    } else {
      return { code, error: "Access Denied" };
    }
  } catch (error: unknown) {
    console.error("sign in", error);
    return { code: "", error: "Internal Server Error" };
  }
};

const checkCodeExistence = async (Code: string) => {
  try {
    const code = await allowedEmailModel.findOne({ code: Code });
    return code;
  } catch (error) {
    throw error;
  }
};
