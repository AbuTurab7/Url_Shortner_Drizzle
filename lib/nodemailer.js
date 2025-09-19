import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export const sendEmail = async ({ to , subject , html }) => {
   const info = await transporter.sendMail({
      from: `URL SHORTNER <${testAccount.user}>`,
        to,
        subject,
        html,
    });

    const testEmailUrl = nodemailer.getTestMessageUrl(info);
    console.log("Verify Email : " , testEmailUrl);
};