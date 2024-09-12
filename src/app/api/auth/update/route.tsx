import { hashPassword, verifyToken } from "@/app/utils/auth";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log(req , "data")

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

// import { hashPassword } from "@/app/utils/auth";
// import prisma from "@/lib";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { token, newPassword } = await req.json();

//     // Find the password reset token
//     const passwordReset = await prisma.user.findUnique({
//       where: { token },
//     });

//     if (!passwordReset) {
//       return NextResponse.json({ success: false, error: "Invalid or expired token." }, { status: 400 });
//     }

//     // Find the user associated with the token
//     const user = await prisma.user.findUnique({
//       where: { id: passwordReset.userId },
//     });

//     if (!user) {
//       return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
//     }

//     // Hash the new password
//     const hashedPassword = await hashPassword(newPassword);

//     // Update the user's password
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { password: hashedPassword },
//     });

//     // Delete the password reset token after use
//     await prisma.passwordReset.delete({
//       where: { token },
//     });

//     return NextResponse.json({ success: true, message: "Password updated successfully." }, { status: 200 });

//   } catch (error) {
//     console.error("Failed to reset password:", error);
//     return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
//   }
// }
