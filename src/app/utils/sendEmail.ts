// src/app/utils/sendEmail.ts

import nodemailer from 'nodemailer';

// Function to send an email
export async function sendEmail(to: string, subject: string, html: string) {
    const transporter =  nodemailer.createTransport({
        host: 'smtp.gmail.com', // or any other email service
        port: 587,
        secure: false,
        // requireTLS: true,
        auth: {
            user: 'manish05.mdb@gmail.com', // your email address
            pass: 'frwkfjhzozkjlsvx', // your email password or app-specific password
        },
        debug: true, 
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    }, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId)})
}
