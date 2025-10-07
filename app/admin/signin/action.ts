import { connectMongoDB } from "@/lib/mongodb";
import { emailModel } from "@/schema/mongoSchema";

export async function signIn(
  prevState: { email: string; error: string },
  formData: FormData
) {
  try {
    await connectMongoDB();
    const email = formData.get("email") as string;
    const checkValidity = await checkEmailExistence(email);
    if (checkValidity) {
      return { email: "", error: "" };
    } else {
      return { email: email, error: "Not a Valid Email Address" };
    }
  } catch (error: unknown) {
    return { email: "", error: "Internal Server Error" };
  }
}

const checkEmailExistence = async (Email: string) => {
  try {
    const email = await emailModel.findOne({ email: Email });
    return email;
  } catch (error) {
    throw error;
  }
};
