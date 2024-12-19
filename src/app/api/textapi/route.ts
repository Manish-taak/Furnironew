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
}

export const POST = async (req: NextRequest) => {
    try {
        const body: ProductRequestBody = await req.json(); // Parse the request body
        const { title, tags, images, options } = body;

        // Validate images
        if (!Array.isArray(images) || images.some((img) => typeof img.url !== "string")) {
            return NextResponse.json(
                { error: "Invalid 'images' format. It must be an array of objects with a 'url' property." },
                { status: 400 }
            );
        }

        // Validate options
        if (typeof options !== "object" || Array.isArray(options)) {
            return NextResponse.json(
                { error: "Invalid 'options' format. It must be an object with key-value pairs." },
                { status: 400 }
            );
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

        console.log(optionRecords, "Option Records");

        // Generate all possible combinations of options
        const generateCombinations = (
            records: { key: string; values: string[] }[]
        ) => {
            const keys = records.map((record) => record.key);
            const values = records.map((record) => record.values);

            // Generate combinations using recursion
            const combine = (arr: string[][], prefix: string[] = []): string[][] => {
                if (arr.length === 0) return [prefix];
                const [first, ...rest] = arr;
                return first.flatMap((value) => combine(rest, [...prefix, value]));
            };

            return combine(values).map((combination) => {
                const variantDetails = combination
                    .map((value, index) => `${keys[index]}: ${value}`)
                    .join(", ");
                return { variantDetails, combination };
            });
        };

        // Generate variant data
        const variantsData = generateCombinations(
            optionRecords.map((record) => ({
                key: record.key,
                values: record.values as string[], // Cast to string[] if Prisma's types are looser
            }))
        );
        console.log(variantsData, "Generated Variants");

        // Save variants to the database

        // console.log(variantDetails)
        
        
        
        await Promise.all(
            variantsData.map(async ({ variantDetails }) => {
                return prisma.variant.create({
                    data: {
                        productId: product.id,
                        optionDetails:"",
                        variantKey: variantDetails, // e.g., "color: red, size: S"
                        price: 0, // Default price or calculated price
                    },
                });
            })
        );

        return NextResponse.json({
            message: "Product, options, and variants added successfully",
            optionRecords,
            variantsData,
        });
    } catch (error: any) {
        console.error("Error adding product:", error);
        return NextResponse.json(
            { error: error?.message || "An error occurred" },
            { status: 500 }
        );
    }
};
