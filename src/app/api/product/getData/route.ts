import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET request to fetch all products with pagination.
 */
export async function GET(req: NextRequest) {
    try {
        // Parse query parameters for limit and offset
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10); // Default limit to 10 if not provided
        const offset = parseInt(searchParams.get('offset') || '0', 10); // Default offset to 0 if not provided

        // Fetch products from the database with pagination
        const products = await prisma.product.findMany({
            skip: offset,
            take: limit,
            include: {
                images: true,
                sizes: true,
                colors: true,
            },
        });


        // Fetch total count of products for pagination metadata
        const totalCount = await prisma.product.count();

        // Return the fetched products with pagination metadata
        return NextResponse.json({
            success: true,
            data: products,
            meta: {
                totalCount,   // Total number of products
                limit,        // Number of products fetched
                offset        // Starting index of fetched products
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
}
