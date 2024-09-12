import { generateToken, hashPassword } from "@/app/utils/auth";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password, phone } = await req.json(); // Include 'phone' in the request body

        // Check if a user with the same email or phone number already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "User with this email or phone number already exists." },
                { status: 409 } // Conflict status
            );
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = await prisma.user.create({
            data: {
                email,
                phone, // Save the phone number as well
                password: hashedPassword,
            },
        });

        // Generate a token
        const token = generateToken(user.id);

        return NextResponse.json({ success: true, token }, { status: 201 });

    } catch (error) {
        console.error("Failed to register user:", error);
        return NextResponse.json({ success: false, error: "Failed to register user" }, { status: 500 });
    }
}
