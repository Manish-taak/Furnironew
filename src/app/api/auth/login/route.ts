import { comparePasswords, generateToken } from "@/app/utils/auth";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Check if the user exists by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 } // Unauthorized status
            );
        }

        // Verify the password
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // Generate a token
        const token = generateToken(user.id);

        return NextResponse.json({ success: true, token, message: "You are successfully logged in" }, { status: 200 });

    } catch (error) {
        console.error("Failed to login user:", error);
        return NextResponse.json({ success: false, error: "Failed to login user" }, { status: 500 });
    }
}
