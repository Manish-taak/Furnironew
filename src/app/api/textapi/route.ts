import ProductList from "@/app/(root)/productComparison/page";
import prisma from "@/lib";
import { NextRequest, NextResponse } from "next/server";
import { number } from "zod";
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
console.log("first", options , "helooptions")

        const product = await prisma.product.create({
            data: {
                title,
                tags,
                optiondetails:options
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

export const DELETE = async (req: NextRequest) => {
    if (req.method === 'DELETE') {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const variantId = searchParams.get('variantId');

        if (!productId || !variantId) {
            return NextResponse.json(
                { error: 'Product ID and Variant ID are required as query parameters.' },
                { status: 400 }
            );
        }

        try {
            const result = await prisma.variant.deleteMany({
                where: {
                    id: Number(variantId),
                    productId: Number(productId)
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
    } else {
        return NextResponse.json(
            { error: 'Method not allowed. Use DELETE.' },
            { status: 405 }
        );
    }
}

// export const PUT = async (req: NextRequest) => {
//     try {
//         const body: Partial<{
//             productId: string;
//             title: string;
//             tags: string[];
//             options: Record<string, string[]>; // Updated options
//             varientdata: Record<string, { stock: number; sku: string; price: number; images: { url: string }[] }>;
//         }> = await req.json();

//         const { productId, title, tags, options, varientdata } = body;

//         if (!productId) {
//             return NextResponse.json(
//                 { error: "Product ID is required to perform an update." },
//                 { status: 400 }
//             );
//         }

//         // Fetch existing variants
//         const existingVariants = await prisma.variant.findMany({
//             where: { productId: Number(productId) },
//             select: { optionDetails: true }, // Fetch optionDetails field
//         });

//         // Get existing option details
//         const existingOptionDetails = existingVariants.map((variant) => variant.optionDetails);

//         // Generate all combinations from new options
//         const newOptionKeys = Object.keys(options || {});
//         const newOptionValues = Object.values(options || []);
//         const newCombinations = generateCombinations(newOptionValues);

//         // Format new combinations into optionDetails-like objects
//         const newOptionDetails = newCombinations.map((combination) =>
//             combination.reduce((details, value, index) => {
//                 details[newOptionKeys[index]] = value;
//                 return details;
//             }, {} as Record<string, string>)
//         );

//         // Compare existingOptionDetails with newOptionDetails
//         const hasOptionsChanged =
//             existingOptionDetails.length !== newOptionDetails.length ||
//             !newOptionDetails.every((newDetail) =>
//                 existingOptionDetails.some((existingDetail) =>
//                     isEqual(existingDetail, newDetail)
//                 )
//             );

//         // If options changed, delete old variants and create new ones
//         if (hasOptionsChanged) {
//             // Delete old variants
//             await prisma.variant.deleteMany({ where: { productId: Number(productId) } });

//             // Create new variants based on newOptionDetails
//             await Promise.all(
//                 newOptionDetails.map(async (optionDetail) => {
//                     const combinationKey = Object.values(optionDetail).join(',');

//                     const variantInfo = varientdata?.[combinationKey] || {
//                         stock: 0,
//                         sku: "",
//                         price: 0,
//                         images: [],
//                     };

//                     await prisma.variant.create({
//                         data: {
//                             productId: Number(productId),
//                             optionDetails: optionDetail,
//                             varianttitle: `${title} / ${combinationKey}`,
//                             price: variantInfo.price,
//                             inventory: variantInfo.stock.toString(),
//                             sku: variantInfo.sku,
//                             images: {
//                                 create: variantInfo.images.map((image) => ({ url: image.url })),
//                             },
//                         },
//                     });
//                 })
//             );
//         }

//         return NextResponse.json({
//             message: hasOptionsChanged
//                 ? "Options changed. Variants updated."
//                 : "Options unchanged. No updates required.",
//         });
//     } catch (error: any) {
//         console.error("Error updating product:", error);
//         return NextResponse.json(
//             { error: error?.message || "An error occurred" },
//             { status: 500 }
//         );
//     }
// };

// // Helper function to generate all combinations
// function generateCombinations(arrays: string[][]): string[][] {
//     if (arrays.length === 0) return [[]];
//     const [first, ...rest] = arrays;
//     const combinations = generateCombinations(rest);
//     return first.flatMap((value) => combinations.map((combination) => [value, ...combination]));
// }

// // Helper function to check if two objects are equal
// function isEqual(obj1: Record<string, string>, obj2: Record<string, string>): boolean {
//     const keys1 = Object.keys(obj1);
//     const keys2 = Object.keys(obj2);
//     if (keys1.length !== keys2.length) return false;
//     return keys1.every((key) => obj1[key] === obj2[key]);
// }


export const PUT = async (req: NextRequest) => {
    try {
        const body: Partial<{
            productId: string;
            title: string;
            tags: string[];
            options: Record<string, string[]>; // Updated options
            varientdata: Record<string, { stock: number; sku: string; price: number; images: { url: string }[] }>;
        }> = await req.json();

        const { productId, title, tags, options, varientdata } = body;

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required to perform an update." },
                { status: 400 }
            );
        }

        // Update product title and tags if provided
        await prisma.product.update({
            where: { id: Number(productId) },
            data: {
                ...(title && { title }),
                ...(tags && { tags }),
            },
        });

        // Fetch existing variants
        const existingVariants = await prisma.variant.findMany({
            where: { productId: Number(productId) },
            select: { optionDetails: true, id: true }, // Fetch optionDetails and IDs
        });

        // Get existing option details
        const existingOptionDetails = existingVariants.map((variant) => variant.optionDetails);

        // Generate all combinations from new options
        const newOptionKeys = Object.keys(options || {});
        const newOptionValues = Object.values(options || []);
        const newCombinations = generateCombinations(newOptionValues);

        // Format new combinations into optionDetails-like objects
        const newOptionDetails = newCombinations.map((combination) =>
            combination.reduce((details, value, index) => {
                details[newOptionKeys[index]] = value;
                return details;
            }, {} as Record<string, string>)
        );

        // Compare existingOptionDetails with newOptionDetails
        const hasOptionsChanged =
            existingOptionDetails.length !== newOptionDetails.length ||
            !newOptionDetails.every((newDetail) =>
                existingOptionDetails.some((existingDetail) =>
                    isEqual(existingDetail, newDetail)
                )
            );

        if (hasOptionsChanged) {
            // Options changed: delete old variants and create new ones
            await prisma.variant.deleteMany({ where: { productId: Number(productId) } });

            await Promise.all(
                newOptionDetails.map(async (optionDetail) => {
                    const combinationKey = Object.values(optionDetail).join(',');

                    const variantInfo = varientdata?.[combinationKey] || {
                        stock: 0,
                        sku: "",
                        price: 0,
                        images: [],
                    };

                    await prisma.variant.create({
                        data: {
                            productId: Number(productId),
                            optionDetails: optionDetail,
                            varianttitle: `${title || "Product"} / ${combinationKey}`,
                            price: variantInfo.price,
                            inventory: variantInfo.stock.toString(),
                            sku: variantInfo.sku,
                            images: {
                                create: variantInfo.images.map((image) => ({ url: image.url })),
                            },
                        },
                    });
                })
            );
        } else if (varientdata) {
            // Options unchanged: Update variant data and varianttitle
            await Promise.all(
                existingVariants.map(async (existingVariant) => {
                    const combinationKey = Object.values(existingVariant.optionDetails).join(',');
                    const variantInfo = varientdata[combinationKey];

                    if (variantInfo) {
                        await prisma.variant.update({
                            where: { id: existingVariant.id },
                            data: {
                                varianttitle: `${title || "Product"} / ${combinationKey}`,
                                price: variantInfo.price,
                                inventory: variantInfo.stock.toString(),
                                sku: variantInfo.sku,
                                images: {
                                    deleteMany: {}, // Clear old images
                                    create: variantInfo.images.map((image) => ({ url: image.url })),
                                },
                            },
                        });
                    }
                })
            );
        }

        return NextResponse.json({
            message: hasOptionsChanged
                ? "Options changed. Variants updated."
                : "Options unchanged. Variant data updated.",
        });
    } catch (error: any) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: error?.message || "An error occurred" },
            { status: 500 }
        );
    }
};

// Helper function to generate all combinations
function generateCombinations(arrays: string[][]): string[][] {
    if (arrays.length === 0) return [[]];
    const [first, ...rest] = arrays;
    const combinations = generateCombinations(rest);
    return first.flatMap((value) => combinations.map((combination) => [value, ...combination]));
}

// Helper function to check if two objects are equal
function isEqual(obj1: Record<string, string>, obj2: Record<string, string>): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every((key) => obj1[key] === obj2[key]);
}

