import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib";
import type { NextApiResponse } from "next";
import { uploadMiddleware, runMiddleware } from "@/app/utils/multer";

interface Image {
  url: string;
}

interface Size {
  size: string;
}

interface Color {
  color: string;
}

interface ProductData {
  title: string;
  price: number;
  description: string;
  images: Image[];
  sizes: Size[];
  colors: Color[];
}

export async function POST(req: NextRequest) {
  console.log(req, "datatatataatatatatat")
  try {
    // Use `multer` middleware to handle the file upload
    await runMiddleware(req, {} as NextApiResponse, uploadMiddleware);

    // Get the request body data
    const data: any = req.body;

    // Extract file information
    const file = (req as any).file;
    const fileUrl = file ? `/uploads/${file.filename}` : '';

    // Create a new product in the database
    const newProduct = await prisma.product.create({
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        images: {
          create: [{ url: fileUrl }, ...data.images.map((image: any) => ({
            url: image.url,
          }))],
        },
        sizes: {
          create: data.sizes.map((size: any) => ({
            size: size.size,
          })),
        },
        colors: {
          create: data.colors.map((color: any) => ({
            color: color.color,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
