import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {






    try {
        // Parse the request body
        const body = await req.json();
        console.log(body, "-=bodybodybodybodybodybodybodybody")

        // Check if the body contains a single object or an array
        if (!body || (!Array.isArray(body) && typeof body !== "object")) {
            return NextResponse.json(
                { error: "Invalid data format. Expected a single object or an array of objects." },
                { status: 400 }
            );
        }

        // Handle single image
        if (!Array.isArray(body)) {
            const { url } = body;
            if (!url) {
                return NextResponse.json(
                    { error: "Missing 'url' field in the provided object." },
                    { status: 400 }
                );
            }

            const singleImage = await prisma.allimages.create({
                data: { url },
            });

            return NextResponse.json(
                { message: "Single image uploaded successfully.", image: singleImage },
                { status: 201 }
            );
        }

        // Handle multiple images
        const imagesToCreate = body.map((item) => {
            if (!item.url) {
                throw new Error("Each object in the array must contain a 'url' field.");
            }
            return { url: item.url };
        });

        const multipleImages = await prisma.allimages.createMany({
            data: imagesToCreate,
        });

        return NextResponse.json(
            { message: "Multiple images uploaded successfully.", count: multipleImages.count },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading images:", error);
        return NextResponse.json(
            {
                error: "An error occurred while uploading images.",
            },
            { status: 500 }
        );
    }
};


