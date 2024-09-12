"use client";

import { useState, useEffect } from 'react';
import img from "@/../public/images/furniture12.png"
import Card from '@/component/ui/Card';
// Define TypeScript types for the Product and Pagination data
type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    images: { id: number; url: string }[];
    sizes: { id: number; size: string }[];
    colors: { id: number; color: string }[];
};

type Pagination = {
    totalCount: number; // Total number of products
    limit: number; // Page size
    offset: number; // Starting index
};

// Define the ProductList component
const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10); // Number of products per page
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);

    // Fetch products from the API
    const fetchProducts = async (page: number, pageSize: number): Promise<void> => {
        try {
            const offset = (page - 1) * pageSize; // Calculate offset based on page and page size
            const response = await fetch(`http://localhost:3000/api/product/getData?limit=${pageSize}&offset=${offset}`);
            const data: { success: boolean; data: Product[]; meta: Pagination } = await response.json();

            if (response.ok && data.success) {
                setProducts(data.data);
                setTotalProducts(data.meta.totalCount);
                setTotalPages(Math.ceil(data.meta.totalCount / pageSize)); // Calculate total pages
            } else {
                console.error('Failed to fetch products:', data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts(page, pageSize);
    }, [page, pageSize]);

    return (
        <>
        {/* {products.map((item,index)=>{
            {console.log(item)}
            <Card bgimage={item.images} description={item.description} name={item.title} price={item.price}/>
        })} */}
        <Card />
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.title} - ${product.price}
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div className='flex justify-center gap-x-[38px] bg-[#FFFFFF] items-center'>
                <button
                    className={`bg-[#F9F1E7] rounded-[10px] border-none py-[15px] px-7 text-[#000000] text-xl leading-8 cursor-pointer transition-all ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className='flex justify-center items-center gap-x-[38px]'>
                    <span className='text-xl py-[15px] px-6 bg-[#B88E2F] rounded-[10px] text-[#000000] cursor-pointer'> {page} </span>
                    <span className='text-xl py-[15px] px-6 bg-[#F9F1E7] rounded-[10px] text-[#000000] cursor-pointer'> {totalPages}</span>
                </span>
                <button
                    className='bg-[#F9F1E7] rounded-[10px] border-none py-[15px] px-7 text-[#000000] text-xl leading-8 cursor-pointer'
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
        </>
    );
};

export default ProductList;
