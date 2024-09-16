// src/app/api/auth/reset-password/verify-otp/route.ts

import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (!user.resetToken || user.resetToken !== otp || user.resetTokenExp! < new Date()) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return NextResponse.json({ success: false, error: "Failed to verify OTP" }, { status: 500 });
  }
}
