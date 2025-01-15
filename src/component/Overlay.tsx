"use client"



import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children }) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle click outside of popup to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener on unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [overlayRef, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={overlayRef} className="bg-white p-6 rounded shadow-lg w-96">
                {children}
            </div>
        </div>
    );
};

export default Overlay;
