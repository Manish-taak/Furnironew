import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create Checkout
export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Read the request body
        const {
            firstName,
            lastName,
            companyName,
            streetAddress,
            city,
            province,
            zipCode,
            phone,
            emailAddress,
            additionalInfo,
            cartId,
        } = body;

        const newCheckout = await prisma.checkout.create({
            data: {
                firstName,
                lastName,
                companyName,
                streetAddress,
                city,
                province,
                zipCode,
                phone,
                emailAddress,
                additionalInfo,
                cart: cartId ? { connect: { id: cartId } } : undefined, // Connect to cart if cartId exists
            },
        });

        return NextResponse.json(newCheckout, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}


