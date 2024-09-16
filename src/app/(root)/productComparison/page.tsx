"use client";

import { useState, useEffect } from 'react';
import Card from '@/component/ui/Card';

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    createdAt: string; 
    updatedAt: string; 
    images: { id: number; url: string }[];
    sizes: { id: number; size: string }[];
    colors: { id: number; color: string }[];
};

type Pagination = {
    totalCount: number;
    limit: number;
    offset: number;
};

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);

    // Fetch products from the API
    const fetchProducts = async (page: number, pageSize: number): Promise<{ success: boolean; data: Product[]; meta: Pagination } | undefined> => {
        try {
            const offset = (page - 1) * pageSize;
            const response = await fetch(`http://localhost:3000/api/product/getData?limit=${pageSize}&offset=${offset}`);
            const data: { success: boolean; data: Product[]; meta: Pagination } = await response.json();

            if (response.ok && data.success) {
                return data;
            } else {
                console.error('Failed to fetch products:', data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        // On initial load, just fetch the products for the first page
        const loadInitialProducts = async () => {
            const data = await fetchProducts(page, pageSize);
            if (data) {
                setProducts(data.data);
                setTotalProducts(data.meta.totalCount);
                setTotalPages(Math.ceil(data.meta.totalCount / pageSize));
            }
        };

        loadInitialProducts();
    }, []);

    // Handle Next Page
    const handleNextPage = async () => {
        const nextPage = page + 1;
        const data = await fetchProducts(nextPage, pageSize);
        if (data) {
            setProducts((prev: Product[]) => [...prev, ...data.data]); // Append new data
            setPage(nextPage);
        }
    };

    // Handle Previous Page
    const handlePreviousPage = async () => {
        if (page > 1) {
            const prevPage = page - 1;
            const data = await fetchProducts(prevPage, pageSize);

            if (data) {
                const updatedProducts = products.slice(0, products.length - data.data.length); // Remove last added page data
                setProducts(updatedProducts);
                setPage(prevPage);
            }
        }
    };

    return (
        <div className='container'>
            <div className='grid grid-cols-4 gap-8 '>
                {products.map(product => (
                    <Card key={product.id} />
                ))}
            </div>
            <div>
                <h1>Products</h1>
                <ul>
                    {products?.map((product) => (
                        <li key={product.id}>
                            {product.title} - ${product.price}
                        </li>
                    ))}
                </ul>

                {/* Pagination Controls */}
                <div className='flex justify-center gap-x-[38px] bg-[#FFFFFF] items-center'>
                    <button
                        className={`bg-[#F9F1E7] rounded-[10px] border-none py-[15px] px-7 text-[#000000] text-xl leading-8 cursor-pointer transition-all ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handlePreviousPage}
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
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
