import { hashPassword, verifyToken } from "@/app/utils/auth";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    // Verify the token
    const decoded: any = verifyToken(token);
    const userId = decoded.id;

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 });
  }
}
