"use client"


import Overlay from '@/component/Overlay';
import React, { useState } from 'react';

const Home = () => {
    const [isOverlayOpen, setOverlayOpen] = useState(false);
    const [isOverlayOpen1, setOverlayOpen1] = useState(false);

    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => setOverlayOpen(true)}
                >
                    Open Popup
                </button>

                <Overlay isOpen={isOverlayOpen} onClose={() => setOverlayOpen(false)}>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Popup Content</h2>
                        <p>amit aalu</p>
                        <button
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                            onClick={() => setOverlayOpen(false)}
                        >
                            Close Popup
                        </button>
                    </div>
                </Overlay>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => setOverlayOpen1(true)}
                >
                    Open Popup1
                </button>

                <Overlay isOpen={isOverlayOpen1} onClose={() => setOverlayOpen1(false)}>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Popup Content</h2>
                        <p>This is your popup content inside the overlay.</p>
                        <button
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                            onClick={() => setOverlayOpen1(false)}
                        >
                            Close Popup
                        </button>
                    </div>
                </Overlay>
            </div>

            <div>
                <div className="flex items-center space-x-5 text-base bg-white py-2">
                    <h4 className="font-semibold text-slate-900">Contributors</h4>
                    <span className="rounded-full ring-2 ring-red-950 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
                </div>
                <div className="mt-3 flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </div>
                <div className="mt-3 text-sm font-medium">
                    <a href="#" className="text-blue-500">+ 198 others</a>
                </div>
            </div>
        </>
    );
};

export default Home;
