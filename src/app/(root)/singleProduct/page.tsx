"use client"

import React, { useState } from 'react'
import CheckboxFilter from '../shop/page';

const page = () => {

    const [items, setItems] = useState<string[]>([]);
    const removeItem = (index: number) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 1);
            return updatedItems;
        });
    };

    const Discount = [
        {
            "id": 1,
            "discount": "80% Above"
        },
        {
            "id": 2,
            "discount": "40-60% Below"
        },
        {
            "id": 3,
            "discount": "20% Below"
        },
        {
            "id": 4,
            "discount": "20-40% Below"
        },
        {
            "id": 5,
            "discount": "60-80% Below"
        }
    ]

    return (
        <>

            <div className="flex flex-wrap gap-[10px]">
                {items.map((item, index) => {
                    return (
                        <div
                            key={Date.now() + index}
                            className="border-[1px] border-[rgba(0, 0, 0, 0.16)] rounded-[16px] py-[3px] px-[4px] flex items-center w-full max-w-max "
                        >
                            <span className="whitespace-nowrap px-[6px] text-Light_Text_Secondary  ">
                                {item}
                            </span>
                            {/* Remove icon for each item */}
                            <div
                                className="cursor-pointer"
                                onClick={() => removeItem(index)}
                            >
                                {/* <Icons type="cuticon" /> */}
                                X
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pr-[4px]">
                <div className="grid grid-cols-2 gap-y-[8.5px]">
                    {Discount.map((item, index) => {
                        return (
                            <div key={Date.now() + index}>
                                {/* Checkbox filter for discount options */}
                                <CheckboxFilter
                                    labelclass="gap-[10px]"
                                    value={item?.discount}
                                    id={item?.discount}
                                    setItems={setItems}
                                    items={items}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

        </>
    )
}

export default page