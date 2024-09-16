import { hashPassword, comparePasswords } from "@/app/utils/auth"; // Assuming verifyPassword is available for password comparison
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    // Fetch the user from the database using the userId
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Verify that the provided old password matches the stored password
    const isPasswordValid = await comparePasswords(oldPassword, user.password); // Assuming verifyPassword compares the plain text and hashed password

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Old password is incorrect" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 });
  }
}