import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST request to create a new product.
 * @param req - The incoming request object
 * @returns A JSON response indicating success or failure
 */

export async function POST(req: NextRequest) {
    // export const POST = async (req: Request, res: NextResponse) => {

    try {
        // Parse the request body to get product data
        const data = await req.json();


        // Create a new product in the database
        const newProduct = await prisma.product.create({
            data: {
                title: data.title,
                price: data.price,
                description: data.description,
                images: {
                    create: data.images.map((image: { url: string }) => ({
                        url: image.url,
                    })),
                },
                sizes: {
                    create: data.sizes.map((size: { size: string }) => ({
                        size: size.size,
                    })),
                },
                colors: {
                    create: data.colors.map((color: { color: string }) => ({
                        color: color.color,
                    })),
                },
            },
        });


        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
    }
    finally {
        prisma.$disconnect()
    }
}