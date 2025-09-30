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
  body: string,
  unsubscribe?: string
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
      text: `${body} ${unsubscribe}`,
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

export const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Future Forte</title>
</head>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
    @font-face {
        font-family: "AliandoRocky";
        src: url('../../public/font/AliandoRocky.ttf') format("truetype");
    }

    *{padding: 0; margin: 0;}
    body{
        background-color: #f9f9f7;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Inter', sans-serif;
    }
    main{
       height: 100vh;
       padding: 10px;
    }
    .footer{
        background-color: black;
        height: 400px;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 30px;
    }
    .socials{
        display: flex;
        gap: 25px;
    }
    .site-name{
        font-family: "AliandoRocky", sans-serif;
        font-size: 50px;
    }
    
    .job, .scholarship, .career{
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
    }
    .scholarship{
        background-color: black;
        color: white;
    }
    .job a, .scholarship a, .career a{
        background-color: rgb(253, 253, 253);
        padding: 8px;
        border-radius: 8px;
        text-decoration: none;
        color: black;
        display: flex;
        width: 200px;
    }
    .job, .career{
        background-color: white;
    }
    .job a, .career a{
        background-color: #f9f9f7;
        color: rgb(0, 0, 0);
    }

    .text{
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
   
    .header{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
        color: white;
        padding: 5px;
    }
    .header h1{font-size: 25px;}


    @media only screen and (max-width:480px) {
        .job, .scholarship, .career{
        width: full;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        justify-content: space-around;
        align-items: center;
        }
        .header h1{
            font-size: 5px;
        }
        .image{
            height: 230px;
        }
        
        .main{
            display: flex;
            gap:50px
        }   
        .site-name{
            font-size: 25px;
        }
        .job a, .scholarship a, .career a{
            width: 200px;
        }
    }

    @media only screen and (max-width:768px) {
        .job, .scholarship, .career{
        width: full;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        justify-content: space-around;
        align-items: center;
        }
        .header h1{
            font-size: 20px;
        }
        .image{
            height: 230px;
        }
        
        .main{
            display: flex;
            gap:50px
        }   
        .image {
            width: 100%;
        }
    }
    
</style>
<body>
    <main>
        <div class="header">
            <h1>Welcome to</h1> <br>
            <p class="site-name">FutureForte !</p>
            
        </div>

        <!-- job opport -->
        <div class="job">
            <div class="text">
                <h2>Find the latest <br> Job Opportunities</h2>
                <small>Get ready to elevate your career with our curated list of job openings that match your skills and interests.</small>
                <a href='${CLIENT_URL}/job'>Search</a>
            </div>
        </div>

        <!-- scholarship opport -->
        <div class="scholarship">
            <div class="text">
                <h2>Find the latest <br>Scholarship Opportunities</h2>
                <small>Explore our  selected scholarships that can help alleviate the financial burden of your academic pursuit</small>
                <a href='${CLIENT_URL}/scholarship'>Search</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Follow us on Social Media</p>
            <div class=" socials">
                <p>Facebook</p>
                <p>Instagram</p>
                <p>X</p>
                <p>LinkedIn</p>
            </div>
        </div>

    </main>
</body>
</html>`;
