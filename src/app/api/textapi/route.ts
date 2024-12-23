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
//             options: Record<string, string[]>;
//             varientdata: Record<string, { stock: number; sku: string; price: number; images: { url: string }[] }>;
//         }> = await req.json();

//         const { productId, title, tags, options, varientdata } = body;

//         if (!productId) {
//             return NextResponse.json(
//                 { error: "Product ID is required to perform an update." },
//                 { status: 400 }
//             );
//         }

//         const checkdataoptions = await prisma.product.findUnique({
//             where: {
//                 id: Number(productId),
//             },
//             select: {
//                 optiondetails: true,
//             },
//         });

//         const areOptionsEqual =
//             checkdataoptions &&
//             checkdataoptions.optiondetails &&
//             options &&
//             Object.keys(options).every((key: any) => {
//                 const optionDetail = checkdataoptions && checkdataoptions?.optiondetails[key];
//                 const compareOption = options[key];

//                 return (
//                     Array.isArray(optionDetail) &&
//                     Array.isArray(compareOption) &&
//                     optionDetail.length === compareOption.length &&
//                     optionDetail.every((val, index) => val === compareOption[index])
//                 );
//             });

//         // Update title or tags if provided
//         if (title || tags) {
//             await prisma.product.update({
//                 where: { id: Number(productId) },
//                 data: {
//                     ...(title && { title }),
//                     ...(tags && { tags }),
//                 },
//             });
//         }

//         if (areOptionsEqual) {
//             if (options) {

//                 console.log(options, "optionsoptionsoptions")
//                 await prisma.product.update({
//                     where: {
//                         id: Number(productId),
//                     },
//                     data: {
//                         optiondetails: options,
//                     },
//                 });

//                 await prisma.productOption.deleteMany({ where: { productId: Number(productId) } });

//                 await Promise.all(
//                     Object.entries(options)?.map(([key, values]) =>
//                         prisma.productOption.create({
//                             data: {
//                                 productId: Number(productId),
//                                 key,
//                                 values,
//                             },
//                         })
//                     )
//                 );

//                 const updatedVariants = Object.entries(varientdata || {})?.map(([variantKey, variantData]) => ({
//                     optionDetails: variantKey,
//                     title: `${title || ""} - ${variantKey.split(",").join(" - ")}`,
//                     price: variantData.price,
//                     stock: variantData.stock.toString(),
//                     sku: variantData.sku,
//                     images: variantData.images,
//                 }));

//                 await prisma.variant.deleteMany({ where: { productId: Number(productId) } });

//                 await Promise.all(
//                     updatedVariants && updatedVariants?.map((variant) =>
//                         prisma.variant.create({
//                             data: {
//                                 productId: Number(productId),
//                                 optionDetails: variant.optionDetails,
//                                 varianttitle: variant.title,
//                                 price: variant.price,
//                                 inventory: variant.stock,
//                                 sku: variant.sku,
//                                 images: {
//                                     create: variant.images?.map((image) => ({ url: image.url })),
//                                 },
//                             },
//                         })
//                     )
//                 );
//             }

//             // if (varientdata) {
//             //     const existingVariants = await prisma.variant.findMany({
//             //         where: { productId: Number(productId) },
//             //     });

//             //     await Promise.all(
//             //         Object.entries(varientdata)?.map(async ([variantKey, variantData]) => {
//             //             const existingVariant = existingVariants.find((v: any) => v.optionDetails.includes(variantKey));

//             //             if (existingVariant) {
//             //                 await prisma.variant.update({
//             //                     where: { id: existingVariant.id },
//             //                     data: {
//             //                         ...(variantData.price && { price: variantData.price }),
//             //                         ...(variantData.stock && { inventory: variantData.stock.toString() }),
//             //                         ...(variantData.sku && { sku: variantData.sku }),
//             //                         ...(variantData.images && {
//             //                             images: {
//             //                                 deleteMany: {}, // Delete old images and create nerw images 
//             //                                 create: variantData?.images.map((image: any) => ({ url: image.url })),
//             //                             },
//             //                         }),
//             //                     },
//             //                 });
//             //             } else {
//             //                 await prisma.variant.create({
//             //                     data: {
//             //                         productId: Number(productId),
//             //                         optionDetails: variantKey,
//             //                         varianttitle: `${title || ""} - ${variantKey.split(",").join(" - ")}`,
//             //                         price: variantData.price,
//             //                         inventory: variantData.stock.toString(),
//             //                         sku: variantData.sku,
//             //                         images: {
//             //                             create: variantData.images?.map((image) => ({ url: image.url })),
//             //                         },
//             //                     },
//             //                 });
//             //             }
//             //         })
//             //     );
//             // }
//         } else {
//             // await prisma.product.update({
//             //     where: {
//             //         id: Number(productId),
//             //     },
//             //     data: {
//             //         optiondetails: options,
//             //     },
//             // });
//             // await prisma.productOption.deleteMany({ where: { productId: Number(productId) } });
//             // const optionRecords = await Promise.all(
//             //     Object.entries(options || {}).map(async ([key, values]) => {
//             //         return prisma.productOption.create({
//             //             data: {
//             //                 productId: Number(productId),
//             //                 key,
//             //                 values,
//             //             },
//             //         });
//             //     })
//             // );
//             // const generateCombinations = (
//             //     records: { key: string; values: string[] }[]
//             // ) => {
//             //     const keys = records?.map((record) => record.key);
//             //     const values = records?.map((record) => record.values);

//             //     const combine = (arr: string[][], prefix: string[] = []): string[][] => {
//             //         if (arr.length === 0) return [prefix];
//             //         const [first, ...rest] = arr;
//             //         return first.flatMap((value: any) => combine(rest, [...prefix, value]));
//             //     };

//             //     return combine(values).map((combination) => {
//             //         const variantDetails = combination
//             //             .map((value: any, index: any) => `${keys[index]}: ${value}`)
//             //             .join(", ");
//             //         return { variantDetails, combination };
//             //     });
//             // };

//             // const variantsData = generateCombinations(
//             //     optionRecords.map((record) => ({
//             //         key: record.key,
//             //         values: record.values as string[],
//             //     }))
//             // );

//             // await prisma.variant.deleteMany({ where: { productId: Number(productId) } });

//             // await Promise.all(
//             //     variantsData.map(async ({ variantDetails, combination }) => {
//             //         const variantTitle = `${title} - ${combination.join("-")}`;
//             //         const stockKey = combination.join(",");
//             //         const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0 };

//             //         return prisma.variant.create({
//             //             data: {
//             //                 productId: Number(productId),
//             //                 optionDetails: variantDetails,
//             //                 varianttitle: variantTitle,
//             //                 price: inventoryData.price,
//             //                 inventory: inventoryData.stock.toString(),
//             //                 sku: inventoryData.sku,
//             //                 images: {
//             //                     create: inventoryData.images?.map((image: any) => ({
//             //                         url: image.url,
//             //                     })),
//             //                 },
//             //             },
//             //         });

//             //     })
//             // );
//         }

//         return NextResponse.json({
//             message: areOptionsEqual ? "Product and variants updated successfully." : "Product, options, and variants created successfully.",
//         });

//     } catch (error: any) {
//         console.error("Error updating product:", error);
//         return NextResponse.json(
//             { error: error?.message || "An error occurred" },
//             { status: 500 }
//         );

//     }
// };

// export const PUT = async (req: NextRequest) => {
//     try {
//         const body: {
//             productId: string;
//             options: Record<string, string[]>;
//             varientdata: Record<string, { stock: number; sku: string; price: number; images: [] }>
//         } = await req.json();

//         const { productId, options, varientdata } = body;

//         if (!productId || typeof productId !== "string") {
//             return NextResponse.json(
//                 { error: "Invalid 'productId'. It must be a non-empty string." },
//                 { status: 400 }
//             );
//         }

//         const existingVariants = await prisma.variant.findMany({
//             where: { productId: Number(productId) },
//             include: { images: true },
//         });

//         const optionRecords = Object.entries(options).map(([key, values]) => ({ key, values }));

//         const generateCombinations = (
//             records: { key: string; values: string[] }[]
//         ) => {
//             const keys = records.map((record) => record.key);
//             const values = records.map((record) => record.values);

//             const combine = (arr: string[][], prefix: string[] = []): string[][] => {
//                 if (arr.length === 0) return [prefix];
//                 const [first, ...rest] = arr;
//                 return first.flatMap((value) => combine(rest, [...prefix, value]));
//             };

//             return combine(values).map((combination) => {
//                 const variantDetails = combination
//                     .map((value, index) => `${keys[index]}: ${value}`)
//                     .join(", ");
//                 return { variantDetails, combination };
//             });
//         };

//         const updatedVariants = generateCombinations(optionRecords);

//         const existingCombinationKeys = new Set(
//             existingVariants.map((variant: any) =>
//                 variant.optionDetails
//                     .split(", ")
//                     .map((detail: any) => detail.split(": ")[1])
//                     .join(",")
//             )
//         );

//         const unchangedVariants = existingVariants.filter((variant: any) => {
//             const combinationKey = variant.optionDetails
//                 .split(", ")
//                 .map((detail: any) => detail.split(": ")[1])
//                 .join(",");
//             return updatedVariants.some(({ combination }) => combination.join(",") === combinationKey);
//         });

//         const obsoleteVariants = existingVariants.filter((variant: any) => {
//             const combinationKey = variant.optionDetails
//                 .split(", ")
//                 .map((detail: any) => detail.split(": ")[1])
//                 .join(",");
//             return !updatedVariants.some(({ combination }) => combination.join(",") === combinationKey);
//         });

//         const newCombinations = updatedVariants.filter(({ combination }) => {
//             const key = combination.join(",");
//             return !existingCombinationKeys.has(key);
//         });

//         // Delete obsolete variants
//         await prisma.variant.deleteMany({
//             where: {
//                 id: { in: obsoleteVariants.map((variant) => variant.id) },
//             },
//         });

//         // Update unchanged variants if needed (e.g., stock or price changes)
//         const updatePromises = unchangedVariants.map(async (variant: any) => {
//             const combinationKey = variant.optionDetails
//                 .split(", ")
//                 .map((detail: any) => detail.split(": ")[1])
//                 .join(",");

//             const inventoryData = varientdata[combinationKey] || { stock: 0, sku: "", price: 0 };

//             return prisma.variant.update({
//                 where: { id: variant.id },
//                 data: {
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                 },
//             });
//         });

//         // Create new variants
//         const newVariantPromises = newCombinations.map(async ({ variantDetails, combination }) => {
//             const variantTitle = `${combination.join(" - ")}`;
//             const stockKey = combination.join(",");
//             const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0 };

//             return prisma.variant.create({
//                 data: {
//                     productId: Number(productId),
//                     optionDetails: variantDetails,
//                     varianttitle: variantTitle,
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                     images: {
//                         create: inventoryData.images?.map((image: any) => ({ url: image.url })) || [],
//                     },
//                 },
//             });
//         });

//         await Promise.all([...updatePromises, ...newVariantPromises]);

//         return NextResponse.json({
//             message: "Product options and variants updated successfully",
//             newVariants: newCombinations,
//             deletedVariants: obsoleteVariants,
//             updatedVariants: unchangedVariants,
//         });
//         //newcombinations
//         // deletedvariants
//         // updatedvariants
//     } catch (error: any) {
//         console.error("Error updating product variants:", error);
//         return NextResponse.json(
//             { error: error?.message || "An error occurred" },
//             { status: 500 }
//         );
//     }
// };




// export const PUT = async (req: NextRequest) => {
//     try {
//         const body: {
//             productId: string;
//             options: Record<string, string[]>;
//             varientdata: Record<string, { stock: number; sku: string; price: number; images: [] }>
//         } = await req.json();

//         const { productId, options, varientdata } = body;

//         if (!productId || typeof productId !== "string") {
//             return NextResponse.json(
//                 { error: "Invalid 'productId'. It must be a non-empty string." },
//                 { status: 400 }
//             );
//         }

//         const existingVariants = await prisma.variant.findMany({
//             where: { productId: Number(productId) },
//             include: { images: true },
//         });

//         const optionRecords = Object.entries(options).map(([key, values]) => ({ key, values }));

//         const generateCombinations = (
//             records: { key: string; values: string[] }[]
//         ) => {
//             const keys = records.map((record) => record.key);
//             const values = records.map((record) => record.values);

//             const combine = (arr: string[][], prefix: string[] = []): string[][] => {
//                 if (arr.length === 0) return [prefix];
//                 const [first, ...rest] = arr;
//                 return first.flatMap((value) => combine(rest, [...prefix, value]));
//             };

//             return combine(values).map((combination) => {
//                 const variantDetails = combination
//                     .map((value, index) => `${keys[index]}: ${value}`)
//                     .join(", ");
//                 return { variantDetails, combination };
//             });
//         };

//         const updatedVariants = generateCombinations(optionRecords);

//         const existingCombinationKeys = new Set(
//             existingVariants.map((variant: any) =>
//                 variant.optionDetails
//                     .split(", ")
//                     .map((detail: any) => detail.split(": ")[1])
//                     .join(",")
//             )
//         );

//         const newCombinations = updatedVariants.filter(({ combination }) => {
//             const key = combination.join(",");
//             return !existingCombinationKeys.has(key);
//         });

//         const updatePromises = existingVariants.map(async (variant: any) => {
//             const combinationKey = variant.optionDetails
//                 .split(", ")
//                 .map((detail: any) => detail.split(": ")[1])
//                 .join(",");

//             const inventoryData = varientdata[combinationKey] || { stock: 0, sku: "", price: 0 };

//             return prisma.variant.update({
//                 where: { id: variant.id },
//                 data: {
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                 },
//             });
//         });

//         const newVariantPromises = newCombinations?.map(async ({ variantDetails, combination }) => {
//             const variantTitle = `${combination.join(" - ")}`;
//             const stockKey = combination.join(",");
//             const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0 };

//             return prisma.variant.create({
//                 data: {
//                     productId: Number(productId),
//                     optionDetails: variantDetails,
//                     varianttitle: variantTitle,
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                     images: {
//                         create: inventoryData.images?.map((image: any) => ({ url: image.url })) || [],
//                     },
//                 },
//             });
//         });

//         await Promise.all([...updatePromises, ...newVariantPromises]);

//         return NextResponse.json({
//             message: "Product options and variants updated successfully",
//             newVariants: newCombinations,
//         });
//     } catch (error: any) {
//         console.error("Error updating product variants:", error);
//         return NextResponse.json(
//             { error: error?.message || "An error occurred" },
//             { status: 500 }
//         );
//     }
// };

// export const PUT = async (req: NextRequest) => {
//     try {
//         const body: {
//             productId: string;
//             options: Record<string, string[]>;
//             varientdata: Record<string, { stock: number; sku: string; price: number; images: [] }>
//         } = await req.json();

//         const { productId, options, varientdata } = body;

//         if (!productId || typeof productId !== "string") {
//             return NextResponse.json(
//                 { error: "Invalid 'productId'. It must be a non-empty string." },
//                 { status: 400 }
//             );
//         }

//         const existingVariants = await prisma.variant.findMany({
//             where: { productId: Number(productId) },
//             include: { images: true },
//         });

//         const optionRecords = Object.entries(options).map(([key, values]) => ({ key, values }));

//         const generateCombinations = (
//             records: { key: string; values: string[] }[]
//         ) => {
//             const keys = records.map((record) => record.key);
//             const values = records.map((record) => record.values);

//             const combine = (arr: string[][], prefix: string[] = []): string[][] => {
//                 if (arr.length === 0) return [prefix];
//                 const [first, ...rest] = arr;
//                 return first.flatMap((value: any) => combine(rest, [...prefix, value]));
//             };

//             return combine(values).map((combination) => {
//                 const variantDetails = combination
//                     .map((value, index) => `${keys[index]}: ${value}`)
//                     .join(", ");
//                 return { variantDetails, combination };
//             });
//         };

//         const updatedVariants = generateCombinations(optionRecords);

//         const existingCombinationKeys = new Set(
//             existingVariants.map((variant: any) =>
//                 variant.optionDetails
//                     .split(", ")
//                     .map((detail: any) => detail.split(": ")[1])
//                     .join(",")
//             )
//         );

//         const newCombinations = updatedVariants.filter(({ combination }) => {
//             const key = combination.join(",");
//             return !existingCombinationKeys.has(key);
//         });

//         const updatePromises = existingVariants.map(async (variant: any) => {
//             const combinationKey = variant.optionDetails
//                 .split(", ")
//                 .map((detail: any) => detail.split(": ")[1])
//                 .join(",");

//             const inventoryData = varientdata[combinationKey] || { stock: 0, sku: "", price: 0 };

//             return prisma.variant.update({
//                 where: { id: variant.id },
//                 data: {
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                     images: {
//                         deleteMany: {}, // Delete old images and create new images
//                         create: inventoryData?.images.map((image: any) => ({ url: image.url })),
//                     },
//                 },
//             });
//         });

//         const newVariantPromises = newCombinations.map(async ({ variantDetails, combination }) => {
//             const variantTitle = `${combination.join(" - ")}`;
//             const stockKey = combination.join(",");
//             const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0 };

//             return prisma.variant.create({
//                 data: {
//                     productId: Number(productId),
//                     optionDetails: variantDetails,
//                     varianttitle: variantTitle,
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                     images: {
//                         create: inventoryData.images?.map((image: any) => ({ url: image.url })) || [],
//                     },
//                 },
//             });
//         });

//         await Promise.all([...updatePromises, ...newVariantPromises]);

//         return NextResponse.json({
//             message: "Product options and variants updated successfully",
//             newVariants: newCombinations,
//         });
//     } catch (error: any) {
//         console.error("Error updating product variants:", error);
//         return NextResponse.json(
//             { error: error?.message || "An error occurred" },
//             { status: 500 }
//         );
//     }
// };

// export const PUT = async (req: NextRequest) => {
//     try {
//         const body: {
//             productId: string;
//             options: Record<string, string[]>;
//             varientdata: Record<string, { stock: number; sku: string; price: number; images: { url: string }[] }>;
//             title?: string;
//             tags?: string[];
//         } = await req.json();

//         const { productId, options, varientdata, title, tags } = body;

//         if (!productId || typeof productId !== "string") {
//             return NextResponse.json(
//                 { error: "Invalid 'productId'. It must be a non-empty string." },
//                 { status: 400 }
//             );
//         }

//         if (title || tags) {
//             await prisma.product.update({
//                 where: { id: Number(productId) },
//                 data: {
//                     ...(title && { title }),
//                     ...(tags && { tags }),
//                 },
//             });
//         }

//         // Fetch existing variants for the product
//         const existingVariants = await prisma.variant.findMany({
//             where: { productId: Number(productId) },
//         });


//         // Update existing variants based on provided `varientdata`
//         await Promise.all(
//             Object.entries(varientdata)?.map(async ([variantKey, variantData]) => {
//                 const existingVariant = existingVariants.find((v: any) => v.optionDetails.includes(variantKey));

//                 if (existingVariant) {
//                     await prisma.variant.update({
//                         where: { id: existingVariant.id },
//                         data: {
//                             ...(variantData.price && { price: variantData.price }),
//                             ...(variantData.stock && { inventory: variantData.stock.toString() }),
//                             ...(variantData.sku && { sku: variantData.sku }),
//                             ...(variantData.images && {
//                                 images: {
//                                     deleteMany: {}, // Delete old images and create nerw images
//                                     create: variantData?.images.map((image: any) => ({ url: image.url })),
//                                 },
//                             }),
//                         },
//                     });
//                 }
//             })
//         );

//         // Generate combinations for new variants
//         const optionRecords = Object.entries(options).map(([key, values]) => ({ key, values }));

//         const generateCombinations = (
//             records: { key: string; values: string[] }[]
//         ) => {
//             const keys = records.map((record) => record.key);
//             const values = records.map((record) => record.values);

//             const combine = (arr: string[][], prefix: string[] = []): string[][] => {
//                 if (arr.length === 0) return [prefix];
//                 const [first, ...rest] = arr;
//                 return first.flatMap((value) => combine(rest, [...prefix, value]));
//             };

//             return combine(values).map((combination) => {
//                 const variantDetails = combination
//                     .map((value, index) => `${keys[index]}: ${value}`)
//                     .join(", ");
//                 return { variantDetails, combination };
//             });
//         };

//         const updatedVariants = generateCombinations(optionRecords);

//         // Get existing combinations for filtering new variants
//         const existingCombinationKeys = new Set(
//             existingVariants.map((variant: any) =>
//                 variant.optionDetails
//                     .split(", ")
//                     .map((detail: any) => detail.split(": ")[1])
//                     .join(",")
//             )
//         );

//         const newCombinations = updatedVariants.filter(({ combination }) => {
//             const key = combination.join(",");
//             return !existingCombinationKeys.has(key);
//         });

//         // Create new variants
//         const newVariantPromises = newCombinations.map(async ({ variantDetails, combination }) => {
//             const variantTitle = `${combination.join(" - ")}`;
//             const stockKey = combination.join(",");
//             const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0, images: [] };

//             return prisma.variant.create({
//                 data: {
//                     productId: Number(productId),
//                     optionDetails: variantDetails,
//                     varianttitle: variantTitle,
//                     price: inventoryData.price,
//                     inventory: inventoryData.stock.toString(),
//                     sku: inventoryData.sku,
//                     images: {
//                         create: inventoryData.images.map((image) => ({ url: image.url })),
//                     },
//                 },
//             });
//         });

//         await Promise.all(newVariantPromises);

//         return NextResponse.json({
//             message: "Product options and variants updated successfully",
//             newVariants: newCombinations,
//         });
//     } catch (error: any) {
//         console.error("Error updating product variants:", error);
//         return NextResponse.json(
//             { error: error?.message || "An error occurred" },
//             { status: 500 }
//         );
//     }
// };


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
                    price: inventoryData.price,
                    inventory: inventoryData.stock.toString(),
                    sku: inventoryData.sku,
                    images: {
                        create: inventoryData.images.map((image) => ({ url: image.url })),
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
