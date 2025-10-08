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
        name: "Opportunity Archives",
        address: "<no-reply@opportunityarchives.com",
      },
      to: receiver,
      replyTo: "<no-reply@opportunityarchives.com",
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
        name: "Opportunity Archives",
        address: "<no-reply@opportunityarchives.com",
      },
      to: "tjayoliver99@gmail.com",
      bcc: receiver,
      replyTo: "<no-reply@opportunityarchives.com",
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
  } catch (error: unknown) {
    throw error;
  }
};

export const sendValidationCode = async (receiver: string, body: string) => {
  try {
    const send = await transporter.sendMail({
      from: {
        name: "Opportunity Archives",
        address: "<no-reply@opportunityarchives.com",
      },
      to: receiver,
      replyTo: "<no-reply@opportunityarchives.com",
      subject: "Validation Code",
      html: `
      <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Opportunity Archives — Your OTP Code</title>
            <style>
              /* General resets for some email clients */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; }

              /* Container */
              .email-wrapper { width: 100%; background-color: #f4f6fb; padding: 24px 0; }
              .email-content { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(12,30,63,0.08); }

              /* Header */
              .brand { padding: 28px 28px 0 28px; display: flex; align-items: center; gap: 12px; }
              .brand-logo { width: 48px; height: 48px; border-radius: 8px; background: linear-gradient(135deg,#0f62fe,#7f5af0); display: inline-block; text-align: center; line-height: 48px; font-weight: 700; color: white; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
              .brand-title { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; font-size: 18px; color: #0b1226; font-weight: 700; }

              /* Body */
              .email-body { padding: 24px 28px 20px 28px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #24324a; }
              .preheader { display:none !important; visibility:hidden; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
              .greeting { margin: 0 0 12px 0; font-size: 16px; }
              .instruction { margin: 0 0 20px 0; font-size: 14px; color: #4b5a77; }

              /* OTP block */
              .otp-box { background: linear-gradient(180deg,#fff 0%, #fbfdff 100%); border: 1px dashed rgba(11,18,38,0.06); padding: 18px; border-radius: 10px; text-align: center; margin: 0 auto 18px auto; max-width: 360px; }
              .otp-code { font-size: 36px; letter-spacing: 6px; font-weight: 800; color: #0f1724; font-family: 'Courier New', Courier, monospace; }
              .otp-note { margin-top: 8px; font-size: 13px; color: #667085; }

              .cta { display:block; text-decoration:none; margin: 12px auto 0 auto; padding: 12px 18px; border-radius: 10px; background: linear-gradient(90deg,#0f62fe,#7f5af0); color: #fff; font-weight: 700; width: fit-content; }

              /* Footer */
              .email-footer { padding: 18px 28px 28px 28px; font-size: 12px; color: #8b95ab; text-align: center; }
              .small { font-size: 12px; color: #98a2b3; }

              /* Responsive tweaks */
              @media only screen and (max-width: 420px) {
                .brand { padding: 20px; }
                .email-body { padding: 18px; }
                .otp-code { font-size: 28px; letter-spacing: 4px; }
                .email-content { border-radius: 8px; }
              }

              /* Outlook fallback for rounded corners */
              @media all and (min-width:0) { .ExternalClass { width:100%; } }
            </style>
          </head>
          <body style="margin:0; padding:0; background-color:#f4f6fb;">

            <!-- Preheader text (appears in inbox preview) -->
            <div class="preheader">Your Opportunity Archives sign‑in code — use it within 30 seconds.</div>

            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-wrapper" width="100%">
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-content" width="100%">

                    <!-- Header -->
                    <tr>
                      <td>
                        <div class="brand">
                          <div>
                            <div class="brand-title">Opportunity Archives</div>
                            <div style="font-size:12px; color:#667085;">Sign in to your account</div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td class="email-body">
                        <h2 class="greeting">Your sign‑in code</h2>
                        <p class="instruction">Use the one‑time passcode below to finish signing in to <strong>Opportunity Archives</strong>. This code is valid for <strong>30 seconds</strong>.</p>

                        <div class="otp-box">
                          <div class="otp-code">${body}</div>
                          <div class="otp-note">Enter this code.</div>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td class="email-footer">
                        <div>©Opportunity Archives</div>
                        <div style="margin-top:8px;">You received this email because a sign‑in to Opportunity Archives was requested for this address.</div>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>

          </body>
        </html>
      `,
    });
    console.log("Mail sent");
  } catch (error: unknown) {
    throw error;
  }
};
