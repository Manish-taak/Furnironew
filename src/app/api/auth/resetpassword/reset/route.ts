// src/app/api/auth/reset-password/reset/route.ts

import { hashPassword } from "@/app/utils/auth";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, otp, newPassword } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if (!user.resetToken || user.resetToken !== otp || user.resetTokenExp! < new Date()) {
            return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
        });

        return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to reset password:", error);
        return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
    }
}
