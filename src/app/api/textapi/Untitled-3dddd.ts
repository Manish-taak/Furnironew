import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";

interface Image {
    url: string;
}

interface Options {
    [key: string]: string[]; // E.g., { color: ["red", "blue"], size: ["S", "M", "L"] }
}

interface Variant {
    key: string; // Key referencing the option, e.g., "color" or "size"
    details: string; // Specific details, e.g., "color: red, size: M"
    price: number;
}

interface ProductRequestBody {
    title: string;
    tags: string[];
    images: Image[];
    options: Options;
    variants: Variant[];
}

export const POST = async (req: NextRequest) => {
    try {
        const body: ProductRequestBody = await req.json(); // Parse the request body
        const { title, tags, images, options } = body;

        // Validate images
        if (!Array.isArray(images) || images.some((img) => typeof img.url !== "string")) {
            return NextResponse.json({ error: "Invalid 'images' format. It must be an array of objects with a 'url' property." }, { status: 400 });
        }

        // Validate options
        if (typeof options !== "object" || Array.isArray(options)) {
            return NextResponse.json({ error: "Invalid 'options' format. It must be an object with key-value pairs." }, { status: 400 });
        }

        // Create the product
        const product = await prisma.product.create({
            data: {
                title,
                tags,
                images: {
                    create: images.map((img) => ({ url: img.url })),
                },
            },
        });

        // Add options and generate variants
        const optionRecords = await Promise.all(
            Object.entries(options).map(async ([key, values]) => {
                return prisma.productOption.create({
                    data: {
                        productId: product.id,
                        key,
                        values,
                    },
                });
            })
        );

        // // Create variants based on combinations
        // await Promise.all(
        //     combinations && combinations?.map(async (variant) => {
        //         return prisma.variant.create({
        //             data: {
        //                 productId: product.id,
        //                 ProductOption: {
        //                     create: {
        //                         key: 'color', // or 'size' depending on the combination
        //                         values: [variant.details.split(', ').map(option => option.split(': ')[1])], // Extract individual option values
        //                     },
        //                 },
        //                 price: variant.price,   
        //             },
        //         });
        //     })
        // );
        
        
        
        for (const color of options.color) {
            for (const size of options.size) {
                await prisma.variant.create({
                    data: {
                        productId: product.id,
                        ProductOption: {
                            create: {
                                key: 'color',
                                values: [color],
                            }
                            price: variant.price,
                        },
                    }
                });
            }
        }

        return NextResponse.json({ message: 'Product, options, and variants added successfully', product }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding product:', error);
        return NextResponse.json({ error: error?.message || "An error occurred" }, { status: 500 });
    }
};