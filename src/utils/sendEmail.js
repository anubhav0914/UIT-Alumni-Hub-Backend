import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load .env variables


export const sendEmail = async ({to, subject, text}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    console.log("Sending email to:", to);

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });

};
