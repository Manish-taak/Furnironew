import prisma from "@/lib"; // Adjust the path to your Prisma client instance
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles DELETE request to delete a product by ID.
 */
export async function DELETE(req: NextRequest) {


    try {
        // Get the product ID from the URL parameters
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        const productId = Number(id);

        if (!id) {
            return NextResponse.json({ success: false, error: "Product ID is required", status:400 });
        }
    
        if(isNaN(productId)){
            return NextResponse.json({ success: false, error: "Product ID is invalid" , status:400 });
        }
    
        const existingProduct = await prisma.product.findUnique({where: { id: productId },});
      
          if (!existingProduct) {
            return NextResponse.json({ error: 'Product with this ID does not exist' , status:400 });
          }
      

        // Delete the product from the database
        const deletedProduct = await prisma.product.delete({
            where: { id: productId },
        });

        // Return a success response
        return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
    }
}
