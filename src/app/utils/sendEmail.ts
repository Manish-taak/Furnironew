// src/app/utils/sendEmail.ts

import nodemailer from 'nodemailer';

// Function to send an email
export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or any other email service
        auth: {
            user: process.env.EMAIL_USER, // your email address
            pass: process.env.EMAIL_PASSWORD, // your email password or app-specific password
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
}
