'use client'

import Button from "@/component/ui/Button";
import React, { useRef, useState } from "react";
import { Controller, useForm, SubmitHandler } from 'react-hook-form'
interface seotags {
    seoTags: string[];
}
interface product {
    title: string,
    defaultprice: string
}
interface Option {
    name: string;
    values: string[];
};

interface Variant {
    id: string;
    combination: string;
    stock: number;
    price: number;
    image: File | null;
    sku: string;
};

type FormData = seotags & Option & Variant & product

const VariantGenerator: React.FC = () => {

    const {
        control,
        setValue,
        getValues,
        watch,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)

    const [inputValue, setInputValue] = useState('');
    const errorRef = useRef<HTMLParagraphElement>(null);

    const tags = watch('seoTags') || [];


    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && tags.length < 5) {
            const updatedTags = [...tags, trimmedValue];
            setValue('seoTags', updatedTags, { shouldValidate: true });
            setInputValue('');
        }
    };

    const removeTag = (index: number) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setValue('seoTags', updatedTags, { shouldValidate: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const [options, setOptions] = useState<Option[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    // const [storedData, setStoredData] = useState<StoredData | null>(null);

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

        // Automatically add a new input if the last value is non-empty and total values are less than 5
        if (
            value.trim() !== "" &&
            valueIndex === updatedOptions[optionIndex].values.length - 1 &&
            updatedOptions[optionIndex].values.length < 5
        ) {
            updatedOptions[optionIndex].values.push("");
        }

        setOptions(updatedOptions);
        generateVariants(updatedOptions);
    };

    const removeOptionValue = (optionIndex: number, valueIndex: number) => {
        const updatedOptions = [...options];

        // Ensure at least one field remains
        if (updatedOptions[optionIndex].values.length > 1) {
            updatedOptions[optionIndex].values = updatedOptions[optionIndex].values.filter((_, i) => i !== valueIndex);
            setOptions(updatedOptions);
            generateVariants(updatedOptions);
        }
    };

    const removeOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
        generateVariants(updatedOptions);
    };

    const generateVariants = (updatedOptions: Option[]) => {
        if (updatedOptions.length === 0) {
            setVariants([]);
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

        const newVariants = combinations.map((combination, index) => ({
            id: `variant-${index}`,
            combination,
            stock: 0,
            price: 0,
            image: null,
            sku: "",
        }));

        setVariants(newVariants);
    };

    const updateVariantField = (
        id: string,
        field: keyof Variant,
        value: Variant[keyof Variant]
    ) => {
        const updatedVariants = variants.map((variant) =>
            variant.id === id ? { ...variant, [field]: value } : variant
        );
        setVariants(updatedVariants);
    };



    return (
        <>
            <section>
                <div className="container">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="title" className='input_label'>Title :</label>
                        <input {...register('title')} className='common_input' id='title' type="text" placeholder='Enter title' />
                        <label htmlFor="price" className='input_label'>Price :</label>
                        <input {...register('defaultprice')} className='common_input' id='price' type="text" placeholder='Enter Price' />
                        <div className="flex flex-col">
                            <label className="input_label" htmlFor="seoTags">
                                SEO Keywords Tag
                            </label>
                            <Controller
                                name="seoTags"
                                control={control}
                                render={() => (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2 mb-2 pt-3">
                                            {tags && tags?.length > 0 && tags?.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-[#FFF3E3] text-[#b88e2f] px-2 py-1 rounded-md flex items-center"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                        onClick={() => removeTag(index)}
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 flex-col ">
                                            <input
                                                id="seoTags"
                                                type="text"
                                                className={`common_input ${tags?.length >= 5 && ' cursor-not-allowed'}`}
                                                placeholder="Type a keyword"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={tags?.length >= 5}
                                            />
                                            {/* Add Tag button (only visible on mobile) */}
                                            <button
                                                type="button"
                                                className={`py-2 w-full px-4 text-white bg-primary-700 rounded-md ${tags?.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-100'} md:hidden`}
                                                onClick={addTag}
                                                disabled={tags?.length >= 5 || !inputValue.trim()}
                                            >
                                                Add Tag
                                            </button>
                                        </div>
                                    </>
                                )}
                            />
                            <p className="text-xs pt-2">*Note: 5 keywords are allowed</p>
                            {errors.seoTags && (
                                <p ref={errorRef} style={{ color: 'red' }}>{errors.seoTags.message}</p>
                            )}
                        </div>
                        <div className="space-y-6">
                            <h1 className="input_label">Product Options and Variants</h1>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Options</h2>
                                {options.map((option, index) => (
                                    <div key={index} className="p-4 border border-[#b88e2f] rounded-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Option Name (e.g., Color)"
                                                value={option.name}
                                                {...register('name')}
                                                onChange={(e) => updateOptionName(index, e.target.value)}
                                                className="common_input"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {option.values.map((value, valueIndex) => (
                                                <div key={valueIndex} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder={`Value ${valueIndex + 1}`}
                                                        value={value}
                                                        {...register(`values.${index}`)}
                                                        onChange={(e) =>
                                                            updateOptionValue(index, valueIndex, e.target.value)
                                                        }
                                                        className="common_input"
                                                    />
                                                    {option.values.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOptionValue(index, valueIndex)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {options.length < 5 && (
                                    <Button
                                        btntype="button"
                                        varient="solid"
                                        className="!py-3"
                                        onCLick={addOption}
                                    >
                                        Add Option
                                    </Button>
                                )}
                            </div>

                            {variants.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Generated Variants</h2>
                                    {variants.map((variant) => (


                                        <div className="flex gap-2" >
                                            <div
                                                key={variant.id}
                                                className="p-4 border border-[#b88e2f] rounded-md"
                                            >
                                                <h4 className="font-medium">{variant.combination}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                                                    <div>
                                                        <label className="block text-sm font-medium">Stock</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={variant.stock}
                                                            {...register('stock')}
                                                            onChange={(e) =>
                                                                updateVariantField(variant.id, "stock", +e.target.value)
                                                            }
                                                            className="common_input"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium">Price</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...register('price')}
                                                            value={variant.price}
                                                            onChange={(e) =>
                                                                updateVariantField(variant.id, "price", +e.target.value)
                                                            }
                                                            className="common_input"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium">SKU</label>
                                                        <input
                                                            type="text"
                                                            value={variant.sku}
                                                            {...register('sku')}
                                                            onChange={(e) =>
                                                                updateVariantField(variant.id, "sku", e.target.value)
                                                            }
                                                            className="common_input"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium">Image</label>
                                                        <input
                                                            type="file"
                                                            {...register('image')}
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                updateVariantField(
                                                                    variant.id,
                                                                    "image",
                                                                    e.target.files ? e.target.files[0] : null
                                                                )
                                                            }
                                                            className="common_input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>
                        <Button btntype="submit" varient='solid' className='!py-4 mt-5' children="Submit Details" />
                    </form>
                </div>
            </section>
        </>
    );
};

export default VariantGenerator;


