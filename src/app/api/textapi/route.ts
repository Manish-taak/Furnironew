import ProductList from "@/app/(root)/productComparison/page";
import prisma from "@/lib";
import { error } from "console";

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

/**  
 * @swagger
 * /api/textapi:
 *      post: 
 *         tags:
 *          - product 
 *      description : return the message hello world
 *      responses:  
 *             200:
 *              desscription : hello world 
 *             400: 
 *               description : hello 400 error
 */

export const POST = async (req: NextRequest) => {
    try {
        const body: ProductRequestBody & {
            varientdata: Record<string, { stock: number; sku: string; price: number, images: [] }>
        } = await req.json();

        const { title, tags, images, options, varientdata } = body;

        if (!Array.isArray(images) || images?.some((img: any) => typeof img?.url !== "string")) {
            return NextResponse.json(
                { error: "Invalid 'images' format. It must be an array of objects with a 'url' property." },
                { status: 400 }
            );
        }

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
                    (item && item?.images?.some((image: any) => typeof image?.url !== "string"))
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

        const product = await prisma.product.create({
            data: {
                title,
                tags,
                optiondetails: options
            },
        });

        await Promise.all(
            Object && Object.entries(options)?.map(async ([key, values]) => {
                if (key.length < 5) {
                    console.log("key limit")
                    return
                }
            })
        );

        const optionRecords = await Promise.all(
            Object.entries(options)?.map(async ([key, values]) => {
                return prisma.productOption.create({
                    data: {
                        productId: product.id,
                        key,
                        values,
                    },
                });
            })
        );


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
            optionRecords.map((record: any) => ({
                key: record.key,
                values: record.values as string[],
            }))
        );

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

/**  
 * @swagger
 *     /api/textapi:
 *      get: 
 *          tags:
 *          - product 
 *      description: return the message hello world
 *      responses:  
 *               200:
 *                 description : hello world 
 *               400: 
 *                 description : hello 400 error
 */

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        if (!productId) {
            const findallproducts = await prisma.product.findMany({
                include: {
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
                }
            })
            return NextResponse.json({ message: "Find All Products", findallproducts }, { status: 200 });
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


/**  
 * @swagger
 * /api/textapi:
 *   delete:
 *        tags:
 *          - product 
 *        description : return the message hello world
 *        responses:  
 *          200:
 *            description : hello world 
 *          400: 
 *            description : hello 400 error
 */

export const DELETE = async (req: NextRequest) => {
    if (req.method === 'DELETE') {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const variantId = searchParams.get('variantId');
        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required.' },
                { status: 400 }
            );
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found.' },
                { status: 404 }
            );
        }

        if (productId && !variantId) {
            try {
                const rem = await prisma.product.delete({
                    where: {
                        id: Number(productId),
                    },
                });
                if (rem) {
                    return NextResponse.json(
                        { success: true, message: 'Product deleted successfully.' },
                        { status: 200 }
                    );
                } else {
                    return NextResponse.json(
                        { success: true, message: 'Product not deleted.' },
                        { status: 400 }
                    );
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                return NextResponse.json(
                    { error: 'Failed to delete product.' },
                    { status: 500 }
                );
            }
        }

        if (productId && variantId) {

            if (!productId || !variantId) {
                return NextResponse.json(
                    { error: 'Product ID and Variant ID are required as query parameters.' },
                    { status: 400 }
                );
            }

            // Delete Variant
            try {
                const result = await prisma.variant.deleteMany({
                    where: {
                        id: Number(variantId),
                        productId: Number(productId),
                    },
                });

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
        }

        // Missing or invalid parameters
        return NextResponse.json(
            { error: 'Product ID is required, and Variant ID is optional.' },
            { status: 400 }
        );
    }

    // Invalid HTTP method
    return NextResponse.json(
        { error: 'Method not allowed. Use DELETE.' },
        { status: 405 }
    );
};
// export const DELETE = async (req: NextRequest) => {
//     if (req.method === 'DELETE') {
//         const { searchParams } = new URL(req.url);
//         const productId = searchParams.get('productId');
//         const variantId = searchParams.get('variantId');

//         if (productId && !variantId) {
//             try {
//                 await prisma.product.delete({
//                     where: {
//                         id: Number(productId),
//                     },
//                 });

//                 return NextResponse.json(
//                     { success: true, message: 'Product deleted successfully.' },
//                     { status: 200 }
//                 );
//             } catch (error) {
//                 console.error('Error deleting product:', error);
//                 return NextResponse.json(
//                     { error: 'Failed to delete product.' },
//                     { status: 500 }
//                 );
//             }
//         }

//         if (productId && variantId) {

//             if (!productId || !variantId) {
//                 return NextResponse.json(
//                     { error: 'Product ID and Variant ID are required as query parameters.' },
//                     { status: 400 }
//                 );
//             }

//             // Delete Variant
//             try {
//                 const result = await prisma.variant.deleteMany({
//                     where: {
//                         id: Number(variantId),
//                         productId: Number(productId),
//                     },
//                 });

//                 if (result.count === 0) {
//                     return NextResponse.json(
//                         { error: 'Variant not found for the given product ID.' },
//                         { status: 404 }
//                     );
//                 }

//                 return NextResponse.json(
//                     { success: true, message: 'Variant deleted successfully.' },
//                     { status: 200 }
//                 );
//             } catch (error) {
//                 console.error('Error deleting variant:', error);
//                 return NextResponse.json(
//                     { error: 'Failed to delete variant.' },
//                     { status: 500 }
//                 );
//             }
//         }

//         // Missing or invalid parameters
//         return NextResponse.json(
//             { error: 'Product ID is required, and Variant ID is optional.' },
//             { status: 400 }
//         );
//     }

//     // Invalid HTTP method
//     return NextResponse.json(
//         { error: 'Method not allowed. Use DELETE.' },
//         { status: 405 }
//     );
// };




/**
 * @swagger
 * /api/textapi:
 *   put:
 *     tags:
 *       - product
 *     description: Returns the message "Hello World".
 *     responses:
 *       200:
 *         description: Successful response with "Hello World".
 *       400:
 *         description: Error response with "400 error".
 */

export const PUT = async (req: NextRequest) => {
    try {
        const body: {
            productId: string;
            options: Record<string, string[]>;
            varientdata: Record<string, { stock: number; sku: string; price: number; images: { url: string }[] }>;
            title?: string;
            tags?: string[];
        } = await req.json();

        const { productId, options, varientdata, title, tags } = body;

        if (!productId || typeof productId !== "string") {
            return NextResponse.json(
                { error: "Invalid 'productId'. It must be a non-empty string." },
                { status: 400 }
            );
        }

        // Update product title and tags

        if (title || tags) {
            await prisma.product.update({
                where: { id: Number(productId) },
                data: {
                    ...(title && { title }),
                    ...(tags && { tags }),
                },
            });
        }

        const existingVariants = await prisma.variant.findMany({
            where: { productId: Number(productId) },
            include: { images: true },
        });

        const updatedVariantss = Object.entries(varientdata || {})?.map(([variantKey, variantData]) => ({
            optionDetails: variantKey,
            title: `${title || ""} - ${variantKey.split(",").join(" - ")}`,
            price: variantData.price,
            stock: variantData.stock.toString(),
            sku: variantData.sku,
            images: variantData.images,
        }));

        await prisma.variant.deleteMany({ where: { productId: Number(productId) } });

        await Promise.all(
            updatedVariantss && updatedVariantss?.map((variant) =>
                prisma.variant.create({
                    data: {
                        productId: Number(productId),
                        optionDetails: variant.optionDetails,
                        varianttitle: variant.title,
                        price: variant.price,
                        inventory: variant.stock,
                        sku: variant.sku,
                        images: {
                            create: variant.images?.map((image) => ({ url: image.url })),
                        },
                    },
                })
            )
        );

        // Generate combinations for new variants
        const optionRecords = Object.entries(options).map(([key, values]) => ({ key, values }));

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

        const updatedVariants = generateCombinations(optionRecords);

        // Identify new combinations for creating new variants
        const existingCombinationKeys = new Set(
            existingVariants.map((variant: any) =>
                variant.optionDetails
                    .split(", ")
                    .map((detail: any) => detail.split(": ")[1])
                    .join(",")
            )
        );

        const newCombinations = updatedVariants.filter(({ combination }) => {
            const key = combination.join(",");
            return !existingCombinationKeys.has(key);
        });

        // Create new variants
        const newVariantPromises = newCombinations.map(async ({ variantDetails, combination }) => {
            const variantTitle = `${combination.join(" - ")}`;
            const stockKey = combination.join(",");
            const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0, images: [] };

            return prisma.variant.create({
                data: {
                    productId: Number(productId),
                    optionDetails: variantDetails,
                    varianttitle: variantTitle,
                    price: inventoryData?.price,
                    inventory: inventoryData?.stock.toString(),
                    sku: inventoryData?.sku,
                    images: {
                        create: inventoryData?.images?.map((image) => ({ url: image.url })),
                    },
                },
            });
        });

        await Promise.all(newVariantPromises);

        return NextResponse.json({
            message: "Product title, tags, options, and variants updated successfully",
            newVariants: newCombinations,
        });
    } catch (error: any) {
        console.error("Error updating product variants:", error);
        return NextResponse.json(
            { error: error?.message || "An error occurred" },
            { status: 500 }
        );
    }
};
