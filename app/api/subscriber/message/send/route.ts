import { NextResponse } from "next/server";
import {
  mailMessagesModel,
  subscribersModel,
  MailInterface,
} from "@/schema/mongoSchema";
import { messageAllSubscribers } from "@/lib/sendMail";
import { nanoid } from "nanoid";
import { connectMongoDB } from "@/lib/mongodb";
import { retrieveFromDatabase as featuredScholarships } from "@/app/api/scholarship/featured/route";
import { retrieveFromDatabase as featuredJobs } from "@/app/api/job/featured/route";
import { checkEnvExistence } from "@/lib/helpers";

const CLIENT_URL = checkEnvExistence("CLIENT_URL");

interface Job {
  id: string;
  position: string;
}

interface Scholarship {
  id: string;
  scholarshipname: string;
}

interface sendNewOpportunityMessageInterface {
  jobs?: Job[];
  scholarships?: Scholarship[];
  CLIENT_URL: string;
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { subject, message }: { subject: string; message?: string } =
      await req.json();
    if (!subject) {
      return NextResponse.json({ status: 400, message: "Subject is required" });
    }
    const subscriber = message
      ? await sendMessageToAllSubscribers(subject, message)
      : await sendNewOpportunitiesToSubscribers(subject);
    return NextResponse.json({
      status: 200,
      message: subscriber.sent ? "Mail Delivered" : "Mail Not Sent",
    });
  } catch (error: unknown) {
    console.error("POST subscriber/send", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const sendMessageToAllSubscribers = async (
  subject: string,
  message: string
) => {
  try {
    const receipients: string[] = await retrieveSubscribersEmails();
    const address: string[] = [...receipients];
    const body = customNotificationTemplate(message, CLIENT_URL);
    const response = await messageAllSubscribers(address, subject, body);
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

const sendNewOpportunitiesToSubscribers = async (subject: string) => {
  try {
    const jobs = await featuredJobs(true);
    const scholarships = await featuredScholarships(true);
    const message = notificationMessageTemplate({
      jobs,
      scholarships,
      CLIENT_URL,
    });
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
    console.error(
      "send New Opportunities To Subscribers subscriber/send",
      error
    );
    throw error;
  }
};

const notificationMessageTemplate = ({
  jobs = [],
  scholarships = [],
  CLIENT_URL,
}: sendNewOpportunityMessageInterface): string => {
  // Convert arrays to <li> links
  const jobLinks = jobs
    .map(
      (job) =>
        `<li><a href="${CLIENT_URL}/${job.id}" style="color:#2563eb; text-decoration:none;">${job.position}</a></li>`
    )
    .join("");

  const scholarshipLinks = scholarships
    .map(
      (sch) =>
        `<li><a href="${sch.id}" style="color:#DC143C; text-decoration:none;">${sch.scholarshipname}</a></li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Opportunity Archives - New Updates</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Inter', Arial, sans-serif; color:#1e293b;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:30px; background-color:#833AB4; background:linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);">
                <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">Opportunity Archives</h1>
              </td>
            </tr>

            <!-- Intro -->
            <tr>
              <td style="padding:30px; border-bottom:1px solid #e2e8f0; text-align:center;">
                <h2 style="font-size:20px; margin:0 0 10px; font-weight:600; color:#0f172a;">
                  🎉 New Opportunities Just Added!
                </h2>
                <p style="margin:0; font-size:16px; color:#475569; line-height:1.6;">
                  We’ve updated our database with fresh job and scholarship opportunities. Here are some highlights:
                </p>
              </td>
            </tr>

            <!-- Jobs -->
            <tr>
              <td style="padding:30px; border-bottom:1px solid #e2e8f0;">
                <h3 style="font-size:18px; margin:0 0 12px; font-weight:600; color:#0f172a;">💼 Latest Jobs</h3>
                <ul style="padding-left:20px; margin:0; font-size:16px; color:#475569; line-height:1.6;">
                  ${jobLinks}
                </ul>
                <div style="margin-top:16px;">
                  <a href="${CLIENT_URL}/jobs" style="background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600; display:inline-block;">Browse All Jobs</a>
                </div>
              </td>
            </tr>

            <!-- Scholarships -->
            <tr>
              <td style="padding:30px;">
                <h3 style="font-size:18px; margin:0 0 12px; font-weight:600; color:#0f172a;">🎓 Latest Scholarships</h3>
                <ul style="padding-left:20px; margin:0; font-size:16px; color:#DC143C; line-height:1.6;">
                  ${scholarshipLinks}
                </ul>
                <div style="margin-top:16px;">
                  <a href="${CLIENT_URL}/scholarships" style="background:#DC143C; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600; display:inline-block;">Browse All Scholarships</a>
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
`;
};

const customNotificationTemplate = (message: string, CLIENT_URL: string) => {
  const template = `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Opportunity Archives - Message</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Inter', Arial, sans-serif; color:#1e293b;">

    <!-- Main Wrapper -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:30px; background: #3F5EFB; background: radial-gradient(circle, rgba(63, 94, 251, 1) 0%, rgba(252, 70, 107, 1) 100%);">
                <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">Opportunity Archives</h1>
              </td>
            </tr>

            <!-- Custom Message Section -->
            <tr>
              <td style="padding:30px;">
                <h2 style="font-size:20px; margin:0 0 12px; font-weight:600; color:#0f172a;">📢 Announcement</h2>
                <p style="margin:0; font-size:16px; color:#475569; line-height:1.6;">
                  ${message}
                </p>
              </td>
            </tr>

            <!-- CTA (Optional) -->
            <tr>
              <td style="padding:30px; text-align:center;">
                <a href="${CLIENT_URL}" style="background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600; display:inline-block;">Visit Website</a>
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
`;
  return template;
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
