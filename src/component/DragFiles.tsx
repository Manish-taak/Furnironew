'use client'
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DragDrop: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }, // Only accept image files
        noClick: true,
        noKeyboard: true,
    });

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const removeAllFiles = () => {
        setFiles([]);
    };

    return (
        <div
            {...getRootProps()}
            className="w-full max-w-md mx-auto p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-f"
        >
            <input {...getInputProps()} />
            <button
                type="button"
                onClick={open}
                className="mt-4 px-4 py-2 bg-black text-white rounded flex mx-auto"
            >
                Select Files
            </button>
            <p className="text-center text-gray-600 mt-3 capitalize">
                Drag and drop files here
            </p>
            <div className="mt-4 flex flex-wrap">
                {files.map((file, index) => (
                    <div key={index} className="relative w-1/4 p-2">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-auto rounded"
                        />
                        <button
                            onClick={() => removeFile(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs  w-5 h-5 rounded-full flex items-start justify-center"
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
            {files.length > 0 && (
                <button
                    type="button"
                    onClick={removeAllFiles}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Remove All Images
                </button>
            )}
        </div>
    );
};

export default DragDrop;
