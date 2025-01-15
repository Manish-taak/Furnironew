import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id } = body; // Assuming `id` is passed in the body or query
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

    try {
        const updatedCheckout = await prisma.checkout.update({
            where: { id: parseInt(id) },
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
                cart: cartId ? { connect: { id: cartId } } : undefined,
            },
        });

        return NextResponse.json(updatedCheckout, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update checkout' }, { status: 500 });
    }
}