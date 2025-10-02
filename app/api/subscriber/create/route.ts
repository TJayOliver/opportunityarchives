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
      return NextResponse.json({ status: 404, message: subscriber.error });
    return NextResponse.json({ status: 201, message: "Success" });
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
        "Empowering Your Journey: Exclusive Job Opportunities, Scholarships, and Career Guidance Await You!",
        `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Future Forte</title>
                </head>
                <style>
                  @import url("https://fonts.googleapis.com/css2?family=Inter:wgh@100..900&display=swap");
                  @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
              
                  * {
                    padding: 0;
                    margin: 0;
                  }
              
                  body {
                    background-color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: "Inter", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: 500;
                    font-style: normal;
                    font-variation-settings: "slnt" 0;
                  }
              
                  main {
                    height: 100vh;
                  }
              
                  .footer {
                    background-color: black;
                    height: 200px;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 30px;
                    width: 100%;
                    max-width: 50%;
                  }
              
                  .socials {
                    display: flex;
                    gap: 25px;
                  }
              
                  .job,
                  .scholarship,
                  .career {
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    padding: 10px;
                  }
              
                  .job a,
                  .scholarship a,
                  .career a {
                    background-color: rgb(253, 253, 253);
                    padding: 8px;
                    border-radius: 8px;
                    text-decoration: none;
                    color: black;
                    display: flex;
                    width: 200px;
                  }
              
                  .job,
                  .career {
                    background-color: white;
                  }
              
                  .text {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                  }
              
                  .header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #153448;
                    padding: 15px;
                  }
              
                  .header h1 {
                    font-size: 25px;
                    font-family: "Bebas Neue", sans-serif;
                    font-weight: 400;
                    font-style: normal;
                    color: white;
                  }
              
                  @media only screen and (max-width: 480px) {
                    .job,
                    .scholarship,
                    .career {
                      width: full;
                      display: flex;
                      flex-wrap: wrap;
                      padding: 10px;
                      justify-content: space-around;
                      align-items: center;
                    }
              
                    .header h1 {
                      font-size: 5px;
                    }
              
                    .main {
                      display: flex;
                      gap: 50px;
                    }
              
                    .site-name {
                      font-size: 25px;
                    }
              
                    .job a,
                    .scholarship a,
                    .career a {
                      width: 200px;
                    }
              
                    .footer {
                      height: 200px;
                    }
                  }
              
                  @media only screen and (max-width: 768px) {
                    .job,
                    .scholarship,
                    .career {
                      width: full;
                      display: flex;
                      flex-wrap: wrap;
                      padding: 10px;
                      justify-content: space-around;
                      align-items: center;
                    }
              
                    .header h1 {
                      font-size: 20px;
                    }
              
                    .image {
                      height: 230px;
                    }
              
                    .main {
                      display: flex;
                      gap: 50px;
                    }
              
                    .image {
                      width: 100%;
                    }
                  }
                </style>
              
                <body>
                  <main>
                    <header class="header">
                      <h1 class="site-name">FUTURE FORTE</h1>
                    </header>
                    <!-- job opport -->
                    <section class="job">
                      <div class="text">
                        <h2>
                          Find the latest <br />
                          Job Opportunities
                        </h2>
                        <small
                          >Get ready to elevate your career with our curated list of job
                          openings that match your skills and interests.</small
                        >
                        <a
                          href="${CLIENT_URL}/job"
                          style="background-color: #153448; font-weight: 500; color: white"
                          >Search</a
                        >
                      </div>
                    </section>
              
                    <!-- scholarship opport -->
                    <section
                      class="scholarship"
                      style="background-color: #153448; color: white"
                    >
                      <div class="text">
                        <h2 style="color:white">Find the latest <br />Scholarship Opportunities</h2>
                        <small
                          >Explore our selected scholarships that can help alleviate the
                          financial burden of your academic pursuit</small
                        >
                        <a
                          href="${CLIENT_URL}/job"
                          style="background-color: white; font-weight: 500; color: black"
                          >Search</a
                        >
                      </div>
                    </section>
              
                    <!-- career opport -->
                    <section class="career">
                      <div class="text">
                        <h2 style="color: black">
                          Read Inspiring <br />
                          Career Guidance Articles
                        </h2>
                        <small style="color: black"
                          >Explore resources that are designed to provide insights and expert
                          advice to help you make decisions</small
                        >
                        <a
                          href="${CLIENT_URL}/job"
                          style="background-color: #153448; font-weight: 500; color: white"
                          >Search</a
                        >
                      </div>
                    </section>
              
                    <section
                      style="
                        background-color: #153448;
                        color: white;
                        padding: 14px;
                        height: 200px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <a
                        href="${CLIENT_URL}/unsubscribe"
                        style="color: white; text-align: center"
                        >Click to Unsubscribe</a
                      >
                    </section>
                  </main>
                </body>
              </html>`
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
