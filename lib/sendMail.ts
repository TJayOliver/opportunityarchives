import nodemailer from "nodemailer";
import { checkEnvExistence } from "./helpers";

const CLIENT_URL = checkEnvExistence("CLIENT_URL");

const transporter = nodemailer.createTransport({
  host: checkEnvExistence("EMAIL_HOST"),
  port: Number(checkEnvExistence("EMAIL_PORT")),
  auth: {
    user: checkEnvExistence("EMAIL_USER"),
    pass: checkEnvExistence("EMAIL_PASSWORD"),
  },
});

export const sendMail = async (
  receiver: string,
  subject: string,
  body: string
) => {
  try {
    const send = await transporter.sendMail({
      from: {
        name: "Future Forte",
        address: "<no-reply@futureforte.com",
      },
      to: receiver,
      replyTo: "<no-reply@futureforte.com",
      subject: subject,
      html: body,
    });
    console.log("Mail sent");
    return {
      sent: true,
      messageId: send.messageId,
      subject: subject,
      receiver: receiver,
    };
  } catch (error) {
    throw error;
  }
};

export const messageAllSubscribers = async (
  receiver: string[],
  subject: string,
  body: string
) => {
  try {
    const send = await transporter.sendMail({
      from: {
        name: "Future Forte",
        address: "<no-reply@futureforte.com",
      },
      to: "tjayoliver99@gmail.com",
      bcc: receiver,
      replyTo: "<no-reply@futureforte.com",
      subject: subject,
      text: `${body}`,
    });
    console.log("Mail sent");
    return {
      sent: true,
      messageId: send.messageId,
      subject: subject,
      receiver: receiver,
    };
  } catch (error) {
    throw error;
  }
};
