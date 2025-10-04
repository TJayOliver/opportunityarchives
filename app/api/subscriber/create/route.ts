import * as z from "zod";
import { NextResponse } from "next/server";
import { SubscriberInterface, subscribersModel } from "@/schema/mongoSchema";
import { nanoid } from "nanoid";
import { checkEnvExistence } from "@/lib/helpers";
import { sendMail } from "@/lib/sendMail";
import { connectMongoDB } from "@/lib/mongodb";

const CLIENT_URL = checkEnvExistence("CLIENT_URL");

const schema = z.object({
  email: z.email(),
});

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 }
      );
    }
    const Email: string = body.email;
    const subscriber = await createSubscriberService(Email);
    if (subscriber.error)
      return NextResponse.json({ status: 200, message: subscriber.error });
    return NextResponse.json({ status: 200, message: "Success" });
  } catch (error: unknown) {
    console.error("POST subscriber/create", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createSubscriberService = async (Email: string) => {
  try {
    const checkEmail = await checkSubscriber(Email);
    if (checkEmail.length > 0) {
      return { error: "Already a Subscriber. Thank You" };
    } else {
      const email = Email;
      const subscriberDetails = { id: nanoid(), email: email };
      const subscriber = await subscriberToDatabase(subscriberDetails);
      if (subscriber.length < 0) return { error: "Sorry Please Try Again" };
      const receiverEmail = subscriberDetails.email;
      await sendMail(
        receiverEmail,
        "Empowering Your Journey: Exclusive Job Opportunities and Scholarships Await You!",
        `<!DOCTYPE html>
      <html lang="en" style="margin:0; padding:0;">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Opportunity Archives</title>
          <!-- Google Font -->
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        </head>
        <body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Inter', Arial, sans-serif; color:#1e293b;">

          <!-- Main Container -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding:20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#0f172a; padding:30px;">
                      <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">Opportunity Archives</h1>
                    </td>
                  </tr>

                  <!-- Job Search Section -->
                  <tr>
                    <td style="padding:30px; border-bottom:1px solid #e2e8f0;">
                      <h2 style="font-size:20px; margin:0 0 12px; font-weight:600; color:#0f172a;">🔍 Job Search</h2>
                      <p style="margin:0; font-size:16px; color:#475569; line-height:1.6;">
                        Explore the latest job opportunities carefully curated for you. Click below to start your job hunt and find the right career path.
                      </p>
                      <div style="margin-top:16px;">
                        <a href="${CLIENT_URL}/jobs" style="background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600; display:inline-block;">Browse Jobs</a>
                      </div>
                    </td>
                  </tr>

                  <!-- Scholarship Section -->
                  <tr>
                    <td style="padding:30px;">
                      <h2 style="font-size:20px; margin:0 0 12px; font-weight:600; color:#0f172a;">🎓 Scholarship Search</h2>
                      <p style="margin:0; font-size:16px; color:#475569; line-height:1.6;">
                        Discover scholarships tailored to your academic journey. Take the next step towards achieving your educational dreams.
                      </p>
                      <div style="margin-top:16px;">
                        <a href="${CLIENT_URL}/scholarships" style="background:#10b981; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600; display:inline-block;">Find Scholarships</a>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding:20px; background:#f1f5f9; font-size:14px; color:#64748b;">
                      <p style="margin:0;">You are receiving this email because you subscribed to <strong>Opportunity Archives</strong>.</p>
                      <p style="margin:10px 0 0;">
                        <a href="${CLIENT_URL}/unsubscribe" style="color:#ef4444; text-decoration:none; font-weight:600;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `
      );
      return subscriber;
    }
  } catch (error: unknown) {
    console.error("SERVICE subscriber/create", error);
    throw error;
  }
};

const checkSubscriber = async (email: string) => {
  try {
    const subscriber = await subscribersModel.find({ email: email });
    return subscriber;
  } catch (error: unknown) {
    console.error("CHECK SUBSCRIBER subscriber/create", error);
    throw error;
  }
};

const subscriberToDatabase = async (details: SubscriberInterface) => {
  try {
    const job = await subscribersModel.create(details);
    return job;
  } catch (error) {
    throw error;
  }
};
