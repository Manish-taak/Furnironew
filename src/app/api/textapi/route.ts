import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";
interface Image {
    url: string;
}

interface Options {
    [key: string]: string[];
}

interface ProductRequestBody {
    title: string;
    tags: string[];
    images: Image[];
    options: Options;
    stock: string
}


export const POST = async (req: NextRequest) => {
    try {
        const body: ProductRequestBody & {
            varientdata: Record<string, { stock: number; sku: string; price: number, images: [] }>
        } = await req.json();

        const { title, tags, images, options, varientdata } = body;

        if (!Array.isArray(images) || images?.some((img: any) => typeof img.url !== "string")) {
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



        if (
            typeof varientdata !== "object" ||
            Array.isArray(varientdata) ||
            Object.values(varientdata)?.some(
                (item) =>
                    typeof item?.stock !== "number" ||
                    typeof item.sku !== "string" ||
                    typeof item.price !== "number" ||
                    (item && item?.images && !Array.isArray(item?.images)) ||
                    (item && item?.images?.some((image: any) => typeof image.url !== "string"))
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid 'varientdata' format. Each value must contain 'stock', 'sku', 'price', and optionally 'images' with valid URLs.",
                },
                { status: 400 }
            );
        }

        // Create the product
        const product = await prisma.product.create({
            data: {
                title,
                tags,
            },
        });

        await Promise.all(
            Object && Object.entries(options)?.map(async ([key, values]) => {
                if (key.length < 5) {
                    console.log("key limit ")
                    return
                }
            })
        );

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
        const variantsData = generateCombinations(
            optionRecords.map((record) => ({
                key: record.key,
                values: record.values as string[],
            }))
        );
        console.log(varientdata, "Generated Variants");

        // Save variants to the database with inventory handling
        await Promise.all(
            variantsData && variantsData?.map(async ({ variantDetails, combination }) => {
                const variantTitle = `${title} - ${combination.join("-")}`;
                const stockKey = combination.join(",");
                const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0 };

                return prisma.variant.create({
                    data: {
                        productId: product.id,
                        optionDetails: variantDetails,
                        varianttitle: variantTitle,
                        price: inventoryData.price,
                        inventory: inventoryData.stock.toString(),
                        sku: inventoryData.sku,
                        images: {
                            create: inventoryData && inventoryData?.images?.map((image: any) => ({
                                url: image.url,
                            })),
                        },
                    }
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



// get products by id 
export const GET = async (req: NextRequest) => {
    try {
        // Parse query parameters if needed
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(productId),
            },
            select: {
                variants: {
                    select: {
                        id: true,
                        productId: true,
                        optionDetails: true,
                        price: true,
                        varianttitle: true,
                        sku: true,
                        inventory: true,
                        images: true
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }


        return NextResponse.json(product, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
    }
};



// export default async function DELETE(req: NextRequest) {
export const DELETE = async (req: NextRequest) => {
    if (req.method === 'DELETE') {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const variantId = searchParams.get('variantId');


        console.log(productId, variantId, "variantIdvariantId")


        // Validate inputs
        if (!productId || !variantId) {
            return NextResponse.json(
                { error: 'Product ID and Variant ID are required as query parameters.' },
                { status: 400 }
            );
        }

        try {
            // Delete the variant
            const result = await prisma.variant.deleteMany({
                where: {
                    id: Number(variantId),
                    productId: Number(productId)
                },
            });

            // Check if any variant was deleted
            if (result.count === 0) {
                return NextResponse.json(
                    { error: 'Variant not found for the given product ID.' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, message: 'Variant deleted successfully.' },
                { status: 200 }
            );

        } catch (error) {
            console.error('Error deleting variant:', error);
            return NextResponse.json(
                { error: 'Failed to delete variant.' },
                { status: 500 }
            );
        }
    } else {
        return NextResponse.json(
            { error: 'Method not allowed. Use DELETE.' },
            { status: 405 }
        );
    }
}
export const PUT = async (req: NextRequest) => {
    try {
        const body: {
            title: string;
            tags: string[];
            price: number;
            images: { url: string }[];
            options: {
                material: string[];
                color: string[];
                size: string[];
            };
            varientdata: Record<
                string,
                {
                    stock: number;
                    sku: string;
                    price: number;
                    images: { url: string }[];
                }
            >;
        } = await req.json();

        const { title, tags, price, images, options, varientdata } = body;

        // Validate main product fields
        if (
            !title ||
            !Array.isArray(tags) ||
            typeof price !== "number" ||
            !Array.isArray(images) ||
            !images.every((image) => typeof image.url === "string") ||
            typeof options !== "object" ||
            !Array.isArray(options.material) ||
            !Array.isArray(options.color) ||
            !Array.isArray(options.size)
        ) {
            return NextResponse.json(
                { error: "Invalid product data format." },
                { status: 400 }
            );
        }

        // Validate variant data
        for (const [key, variant] of Object.entries(varientdata)) {
            if (
                typeof variant.stock !== "number" ||
                typeof variant.sku !== "string" ||
                typeof variant.price !== "number" ||
                !Array.isArray(variant.images) ||
                !variant.images.every((image) => typeof image.url === "string")
            ) {
                return NextResponse.json(
                    { error: `Invalid variant data format for key: ${key}` },
                    { status: 400 }
                );
            }
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { title }, // Assuming `title` uniquely identifies the product. Adjust based on your schema.
            data: {
                title,
                tags,
                price,
                images: {
                    deleteMany: {}, // Clear existing images
                    create: images.map((image) => ({ url: image.url })),
                },
                options: {
                    material: options.material,
                    color: options.color,
                    size: options.size,
                },
                variants: {
                    deleteMany: {}, // Clear existing variants
                    create: Object.entries(varientdata).map(([key, variant]) => ({
                        key,
                        stock: variant.stock,
                        sku: variant.sku,
                        price: variant.price,
                        images: {
                            create: variant.images.map((image) => ({ url: image.url })),
                        },
                    })),
                },
            },
        });

        return NextResponse.json({
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (error: any) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: error?.message || "An error occurred" },
            { status: 500 }
        );
    }
};







