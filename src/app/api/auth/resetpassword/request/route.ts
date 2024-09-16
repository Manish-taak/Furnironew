// src/app/api/auth/reset-password/request/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/sendEmail";
import { generateOtp } from "@/app/utils/generateOtp";
import { addMinutes } from "date-fns";
import prisma from "@/lib";

export async function POST(req: NextRequest) {

    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const otp = generateOtp();
        const expirationTime = addMinutes(new Date(), 10);

        await prisma.user.update({
            where: { email },
            data: { resetToken: otp, resetTokenExp: expirationTime },
        });

        await sendEmail(
            user.email!,
            "Reset Your Password furniro",
            `<p>Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        );

        return NextResponse.json({ success: true, message: "OTP sent to email" }, { status: 200 });
    } catch (error) {
        console.error("Failed to request password reset:", error);
        return NextResponse.json({ success: false, error: "Failed to request password reset" }, { status: 500 });
    }
}
