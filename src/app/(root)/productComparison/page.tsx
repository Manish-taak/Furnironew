"use client"

import { useState, useEffect } from 'react';

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
    page: number;
    pageSize: number;
    totalPages: number;
    totalProducts: number;
};

// Define the ProductList component
const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

    // Fetch products from the API
    const fetchProducts = async (page: number, pageSize: number): Promise<void> => {
        try {
            const response = await fetch(`/api/products?page=${page}&pageSize=${pageSize}`);
            const data: { data: Product[]; pagination: Pagination } = await response.json();

            if (response.ok) {
                setProducts(data.data);
                setTotalPages(data.pagination.totalPages);
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
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>
                    <span>{page}</span>
                    <span>{totalPages}</span>
                </span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
