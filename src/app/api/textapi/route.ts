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
            varientdata: Record<string, { stock: number; sku: string; price: number, images: string[] }>
        } = await req.json();
        const { title, tags, images, options, varientdata } = body;

        if (!Array.isArray(images) || images?.some((img) => typeof img.url !== "string")) {
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
            typeof options !== "object" ||
            Array.isArray(options) ||
            Object.keys(options).length > 5 ||
            Object.values(options).some((value) => !Array.isArray(value) || value.length === 0)
        ) {
            return NextResponse.json(
                {
                    error: "Invalid 'options' format. Maximum of 5 options are allowed, and each option must have at least one value.",
                },
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

        const product = await prisma.product.create({
            data: {
                title,
                tags,
            },
        });

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
                const stockKey = combination.join(","); // Match with the inventory key
                const inventoryData = varientdata[stockKey] || { stock: 0, sku: "", price: 0, images };


                return prisma.variant.create({
                    data: {
                        productId: product.id,
                        optionDetails: variantDetails,
                        varianttitle: variantTitle,
                        price: inventoryData.price,
                        inventory: inventoryData.stock.toString(),
                        sku: inventoryData.sku,
                        images: {
                            create: inventoryData && inventoryData?.images.map((image: any) => ({
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
            return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(productId),
            },
            select: {
                variants: {
                    select: {
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
