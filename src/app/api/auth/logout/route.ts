import { comparePasswords, generateToken } from "@/app/utils/auth";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePasswords(password, user.password))) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a token
    const token = generateToken(user.id);

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.error("Failed to login user:", error);
    return NextResponse.json({ success: false, error: "Failed to login user" }, { status: 500 });
  }
}
