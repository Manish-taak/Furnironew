"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import DragAndDrop from "./Dropgrag";
import DragDrop from "@/component/DragFiles";

interface Option {
    name: string;
    values: string[];
}

interface Variant {
    id: string;
    stock: number;
    price: number;
    images: { url: string }[];
    sku: string;
    combination: string;
}

interface FormData {
    title: string;
    defaultprice: string;
    tags: string[];
    varientdata: Variant[];
}

interface UploadedImages {
    [key: string]: string[];
}

const VariantGenerator: React.FC = () => {
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            tags: [],
            varientdata: [],
        },
    });

    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [varientdata, setvarientdata] = useState<Variant[]>([]);
    console.log(varientdata, "varientdatavarientdata")
    const [uploadedImages, setUploadedImages] = useState<UploadedImages>({});
    const [loading, setLoading] = useState(false)

    const tags = watch("tags") || [];

    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && tags.length < 5) {
            const updatedTags = [...tags, trimmedValue];
            setValue("tags", updatedTags, { shouldValidate: true });
            setInputValue("");
        }
    };

    const removeTag = (index: number) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setValue("tags", updatedTags, { shouldValidate: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, { name: "", values: [""] }]);
        }
    };

    const updateOptionName = (index: number, name: string) => {
        const updatedOptions = [...options];
        updatedOptions[index].name = name;
        setOptions(updatedOptions);
    };

    const updateOptionValue = (optionIndex: number, valueIndex: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[optionIndex].values[valueIndex] = value;

        if (
            value.trim() !== "" &&
            valueIndex === updatedOptions[optionIndex].values.length - 1 &&
            updatedOptions[optionIndex].values.length < 5
        ) {
            updatedOptions[optionIndex].values.push("");
        }

        setOptions(updatedOptions);
        generatevarientdata(updatedOptions);
    };

    const removeOptionValue = (optionIndex: number, valueIndex: number) => {
        const updatedOptions = [...options];
        if (updatedOptions[optionIndex].values.length > 1) {
            updatedOptions[optionIndex].values = updatedOptions[optionIndex].values.filter(
                (_, i) => i !== valueIndex
            );
            setOptions(updatedOptions);
            generatevarientdata(updatedOptions);
        }
    };

    const removeOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
        generatevarientdata(updatedOptions);
    };

    const generatevarientdata = (updatedOptions: Option[]) => {
        if (updatedOptions.length === 0) {
            setvarientdata([]);
            return;
        }
        const combinations = updatedOptions.reduce<string[]>(
            (acc, option) =>
                acc.flatMap((prev) =>
                    option.values
                        .filter((value) => value.trim() !== "")
                        .map((value) => (prev ? `${prev} - ${value}` : value))
                ),
            [""]
        );
        const newvarientdata = combinations.map((combination, index) => ({
            id: `variant-${index}`,
            stock: 0,
            combination,
            price: 0,
            images: [],
            sku: "",
        }));
        setvarientdata(newvarientdata);
        setValue("varientdata", newvarientdata, { shouldValidate: true });
    };

    const updateVariantField = (id: string, field: keyof Variant, value: Variant[keyof Variant]) => {
        const updatedvarientdata = varientdata.map((variant) =>
            variant.id === id ? { ...variant, [field]: value } : variant
        );
        setvarientdata(updatedvarientdata);
        setValue("varientdata", updatedvarientdata, { shouldValidate: true });
    };

    const handleImageUpload = (variantId: string, files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files);
        const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
        setUploadedImages((prev) => ({
            ...prev,
            [variantId]: (prev[variantId] || []).concat(previewUrls),
        }));
        const uploadedImages = Array.from(files).map((file) => ({ url: file.name }));
        const updatedvarientdata = varientdata.map((variant) =>
            variant.id === variantId ? { ...variant, images: uploadedImages } : variant
        );
        setvarientdata(updatedvarientdata);
        setValue("varientdata", updatedvarientdata, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        const optionData: Record<string, string[]> = {};
        options.forEach((option) => {
            if (option.name.trim() !== "") {
                const filteredValues = option.values.filter((value) => value.trim() !== "");
                optionData[option.name] = filteredValues;
            }
        });

        const payload = {
            ...data,
            options: optionData,
        };

        try {
            const res = await fetch("/api/textapi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            console.log("Response:", result);
        } catch (error) {
            console.error("Error posting data:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.dataTransfer.setData("id", id.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
        e.preventDefault();
        const draggedId = parseInt(e.dataTransfer.getData("id"), 10);

        if (draggedId === targetId) return;

        const draggedIndex = varientdata.findIndex((item: any) => item.id === draggedId);
        const targetIndex = varientdata.findIndex((item: any) => item.id === targetId);

        const updatedItems = [...varientdata];
        const [draggedItem] = updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(targetIndex, 0, draggedItem);
        setvarientdata(updatedItems);
    };

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <div className="grid grid-cols-2">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 bg-gray-50 rounded-lg shadow-md sticky top-0 overflow-y-auto h-screen"
                >
                    <h1 className="text-2xl font-bold text-center mb-6">Variant Generator</h1>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Title:</label>
                        <input
                            {...register("title")}
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                            placeholder="Enter title"
                        />
                    </div>
                    {/* Default Price */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Default Price:</label>
                        <input
                            {...register("defaultprice")}
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                            placeholder="Enter default price"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">SEO Tags:</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-[20px]"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500"
                                        onClick={() => removeTag(index)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a tag"
                            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                        />
                    </div>
                    {/* Options */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Options</h2>
                        {options.map((option, index) => (
                            <div key={index} className="mb-4">
                                <input
                                    value={option.name}
                                    onChange={(e) => updateOptionName(index, e.target.value)}
                                    placeholder="Option name"
                                    className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                                />
                                {option.values.map((value, valueIndex) => (
                                    <div key={valueIndex} className="flex items-center space-x-2 mb-2">
                                        <input
                                            value={value}
                                            onChange={(e) => updateOptionValue(index, valueIndex, e.target.value)}
                                            placeholder={`Value ${valueIndex + 1}`}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOptionValue(index, valueIndex)}
                                            className="text-red-500 underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 underline"
                                >
                                    Remove Option
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addOption}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Add Option
                        </button>
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${loading && "cursor-not-allowed"}`}
                    >
                        Submit
                    </button>
                </form>

                <div>
                    <h2 className="text-2xl font-semibold my-7 text-center">varientdata</h2>
                    {
                        varientdata.length > 0 && varientdata && varientdata.map((variant: any) => (
                            <div
                                key={variant.id}
                                id={`item-${variant.id}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, variant.id)}
                                onDragOver={allowDrop}
                                onDrop={(e) => handleDrop(e, variant.id)}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                    cursor: "grab",
                                    textAlign: "center",
                                }}
                            >
                                <div key={variant.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100  " >
                                    <p className="font-medium mb-2">{variant?.combination}</p>
                                    <label className="text-base text-gray-500 capitalize" htmlFor="stock">stock</label>
                                    <input
                                        type="text"
                                        value={variant.stock}
                                        onChange={(e) => updateVariantField(variant.id, "stock", +e.target.value)}
                                        placeholder="Stock"
                                        className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                                    />
                                    <label className="text-base text-gray-500 capitalize" htmlFor="price">price</label>
                                    <input
                                        type="text"
                                        value={variant.price}
                                        onChange={(e) => updateVariantField(variant.id, "price", +e.target.value)}
                                        placeholder="Price"
                                        className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                                    />
                                    <label className="text-base text-gray-500 capitalize" htmlFor="sku">sku</label>
                                    <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => updateVariantField(variant.id, "sku", e.target.value)}
                                        placeholder="SKU"
                                        className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
                                    />
                                    <DragDrop onChange={(e: any) => handleImageUpload(variant.id, e.target.files)} />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default VariantGenerator;