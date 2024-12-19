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
}
export const POST = async (req: NextRequest) => {
    try {
        const body: ProductRequestBody = await req.json();
        const { title, tags, images, options } = body;
        // Validate images
        if (!Array.isArray(images) || images?.some((img) => typeof img.url !== "string")) {
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
                    create: images?.map((img: any) => ({ url: img.url })),
                },
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
            Object && Object.entries(options)?.map(async ([key, values]) => {
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
            const keys = records && records?.map((record: any) => record?.key);
            const values = records && records?.map((record: any) => record?.values);
            // Generate combinations using recursion
            const combine = (arr: string[][], prefix: string[] = []): string[][] => {
                if (arr.length === 0) return [prefix];
                const [first, ...rest] = arr;
                return first.flatMap((value: any) => combine(rest, [...prefix, value]));
            };


            return combine(values)?.map((combination: any) => {
                const variantDetails = combination
                    .map((value: any, index: any) => `${keys[index]}: ${value}`)
                    .join(", ");
                return { variantDetails, combination };
            });

        };
        
        // Generate variant data
        const variantsData = generateCombinations(
            optionRecords && optionRecords?.map((record) => ({
                key: record?.key,
                values: record?.values as string[], // Cast to string[] if Prisma's types are looser
            }))
        );
        console.log(variantsData, "Generated Variants");
        // Save variants to the database     
        await Promise.all(
            variantsData && variantsData?.map(async ({ variantDetails, combination }) => {
                const variantTitle = `${title} - ${combination.join("-")}`;  // Concatenate only values
                return prisma.variant.create({
                    data: {
                        productId: product.id,
                        optionDetails: variantDetails,
                        varianttitle: variantTitle,
                        price: 0,
                    },
                });
            })
        );

        // await Promise.all(
        //     variantsData.map(async ({ combination }) => {
        //       const variantTitle = `${title} - ${combination.join(", ")}`; // Concatenate only values
        //       return prisma.variant.create({
        //         data: {
        //           productId: product.id,
        //           optionDetails: variantTitle, // Save the variant title with values only
        //           price: price, // Assign the product price
        //         },
        //       });
        //     })
        //   );

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




// get data by id 
// GET /api/textapi?productId=1

export const GET = async (req: NextRequest) => {
    try {
        // Parse query parameters if needed
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
        }

        // Fetch product details, options, and variants

        // const product = await prisma.product.findUnique({
        //     where: {
        //         id: parseInt(productId),
        //     },
        //     select:{
        //     },
        //     include: {
        //         images: true,
        //         options: true,
        //         variants: true,
        //     },
        // });

        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(productId),
            },
            select: {
                variants: {
                    select: {
                        productOptionId: true,
                        productId: true,
                        optionDetails: true,
                        price: true,
                        varianttitle: true,
                        sku: true,
                        inventory: true
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        // // Format the response
        // const responseData = {
        //     id: product.id,
        //     title: product.title,
        //     tags: product.tags,
        //     images: product.images,
        //     options: product.options?.map((option: any) => ({
        //         key: option.key,
        //         values: option.values,
        //     })),
        //     variants: product.variants?.map((variant: any) => ({
        //         id: variant.id,
        //         key: variant.variantKey,
        //         details: variant.optionDetails,
        //         price: variant.price,
        //     })),
        //     createdAt: product.createdAt,
        //     updatedAt: product.updatedAt,
        // };

        return NextResponse.json(product, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
    }
};


// export const POST = async (req: NextRequest) => {
//     try {
//       const body: ProductRequestBody = await req.json();
//       const { title, tags, images, options, price } = body;
//       // Validate images
//       if (!Array.isArray(images) || images?.some((img) => typeof img.url !== "string")) {
//         return NextResponse.json(
//           { error: "Invalid 'images' format. It must be an array of objects with a 'url' property." },
//           { status: 400 }
//         );
//       }
//       // Validate options
//       if (typeof options !== "object" || Array.isArray(options)) {
//         return NextResponse.json(
//           { error: "Invalid 'options' format. It must be an object with key-value pairs." },
//           { status: 400 }
//         );
//       }
//       // Create the product
//       const product = await prisma.product.create({
//         data: {
//           title,
//           tags,
//           images: {
//             create: images.map((img) => ({ url: img.url })),
//           },
//         },
//       });
//       const optionRecords = await Promise.all(
//         Object.entries(options)?.map(async ([key, values]) => {
//           return prisma.productOption.create({
//             data: {
//               productId: product.id,
//               key,
//               values,
//             },
//           });
//         })
//       );
//       console.log(optionRecords, "Option Records");
//       // Generate all possible combinations of options
//       const generateCombinations = (records: { key: string; values: string[] }[]) => {
//         const values = records.map((record) => record.values);
//         // Generate combinations using recursion
//         const combine = (arr: string[][], prefix: string[] = []): string[][] => {
//           if (arr.length === 0) return [prefix];
//           const [first, ...rest] = arr;
//           return first.flatMap((value) => combine(rest, [...prefix, value]));
//         };
//         return combine(values).map((combination) => ({ combination }));
//       };
//       // Generate variant data
//       const variantsData = generateCombinations(
//         optionRecords.map((record) => ({
//           key: record.key,
//           values: record.values as string[], // Cast to string[] if needed
//         }))
//       );
//       console.log(variantsData, "Generated Variants");
//       // Save variants to the database
//       await Promise.all(
//         variantsData.map(async ({ combination }) => {
//           const variantTitle = `${title}-${combination.join("-")} `; // Concatenate only values
//           return prisma.variant.create({
//             data: {
//               productId: product.id,
//               optionDetails: variantTitle, // Save the variant title with values only
//               price: price, // Assign the product price
//             },
//           });
//         })
//       );
//       return NextResponse.json({
//         message: "Product, options, and variants added successfully",
//         optionRecords,
//         variantsData,
//       });
//     } catch (error: any) {
//       console.error("Error adding product:", error);
//       return NextResponse.json(
//         { error: error?.message || "An error occurred" },
//         { status: 500 }
//       );
//     }
//   };