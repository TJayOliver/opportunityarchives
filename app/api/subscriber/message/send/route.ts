import { NextResponse } from "next/server";
import {
  mailMessagesModel,
  subscribersModel,
  MailInterface,
} from "@/schema/mongoSchema";
import { messageAllSubscribers } from "@/lib/sendMail";
import { nanoid } from "nanoid";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { subject, message } = await req.json();
    const subscriber = await messageAllSubscribersService(subject, message);
    if (subscriber.sent) {
      return NextResponse.json({ status: 201, message: "Mail Delivered" });
    } else {
      return NextResponse.json({ status: 200, message: "Mail Not Sent" });
    }
  } catch (error: unknown) {
    console.error("POST subscriber/send", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const messageAllSubscribersService = async (
  subject: string,
  message: string
) => {
  try {
    const receipients: string[] = await retrieveSubscribersEmails();
    const address: string[] = [...receipients];
    const response = await messageAllSubscribers(address, subject, message);
    const details: MailInterface = {
      id: nanoid(),
      subject: response.subject,
      message: message,
      receiver: "To All Subscribers",
    };
    await messageToDatabase(details);
    return { sent: !!response.sent };
  } catch (error: unknown) {
    console.error("SERVICE subscriber/send", error);
    return { sent: false };
  }
};

const retrieveSubscribersEmails = async (): Promise<string[]> => {
  try {
    const subscribers = await subscribersModel.find().select({ email: 1 });
    return subscribers.map((s) => s.email);
  } catch (error: unknown) {
    console.error("READ SUBSCRIBERS EMAIL subscriber/send", error);
    throw error;
  }
};

const messageToDatabase = async (details: MailInterface) => {
  try {
    await mailMessagesModel.create(details);
  } catch (error) {
    throw error;
  }
};
