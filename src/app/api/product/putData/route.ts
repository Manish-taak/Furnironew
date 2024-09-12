import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const data = await req.json();
    if (!id) {
        return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const updateProduct = await prisma.product.update({where:{id: Number(id)}, 
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
        
    })
    return NextResponse.json({ success: true, message: "Product updated successfully", product: updateProduct }, { status: 200 });
} catch (error) {
    return NextResponse.json({status:500})
}finally{
prisma.$disconnect()
}
}




