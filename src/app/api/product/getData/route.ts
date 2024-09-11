import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";



/**
 * Handles GET request to fetch all products.
 */
export async function GET(req: NextRequest) {
    try {
      // Fetch all products from the database
      const products = await prisma.product.findMany({
        include: {
          images: true,
          sizes: true,
          colors: true,
        },
      });
  
      // Return the fetched products
      return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
  }