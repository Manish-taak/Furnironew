import React from 'react';
import Link from 'next/link';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-9xl font-bold text-blue-500">404</h1>
                <h2 className="text-2xl font-semibold mt-4">Oops! Page Not Found</h2>
                <p className="text-lg mt-2 mb-6 text-gray-600">
                    Sorry, but the page you are looking for doesn't exist.
                </p>
                <Link href="/">
                    <a className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Go back home
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
