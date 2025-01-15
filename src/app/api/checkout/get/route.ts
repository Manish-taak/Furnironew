import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        const checkout = await prisma.checkout.findUnique({
            where: { id: Number(id) },
            include: {
                cart: true, // Include related cart information
            },
        });

        if (!checkout) {
            return NextResponse.json({ error: 'Checkout not found' }, { status: 404 });
        }

        return NextResponse.json(checkout, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve checkout' }, { status: 500 });
    }
}
