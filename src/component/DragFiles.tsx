

// export default DragDrop;
'use client'

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DragDropProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // onChange handler passed as a prop
}

const DragDrop: React.FC<DragDropProps> = ({ onChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  // Handle files drop
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);

    // Create a fake ChangeEvent for onChange
    const fileInputEvent = {
      target: { files: newFiles },
    } as unknown as React.ChangeEvent<HTMLInputElement>; // Cast to unknown first, then to ChangeEvent

    onChange(fileInputEvent); // Call onChange with the updated file list
  };

  // Handle file input change (manual selection)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      // Create a fake ChangeEvent for onChange
      const fileInputEvent = {
        target: { files: updatedFiles },
      } as unknown as React.ChangeEvent<HTMLInputElement>; // Cast to unknown first, then to ChangeEvent

      onChange(fileInputEvent); // Call onChange with the updated file list
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    // Create a fake ChangeEvent for onChange
    const fileInputEvent = {
      target: { files: updatedFiles },
    } as unknown as React.ChangeEvent<HTMLInputElement>; // Cast to unknown first, then to ChangeEvent

    onChange(fileInputEvent); // Call onChange with the updated file list
  };

  const removeAllFiles = () => {
    setFiles([]);

    // Create a fake ChangeEvent for onChange
    const fileInputEvent = {
      target: { files: [] },
    } as unknown as React.ChangeEvent<HTMLInputElement>; // Cast to unknown first, then to ChangeEvent

    onChange(fileInputEvent); // Call onChange with an empty list to remove all files
  };

  return (
    <div
      {...getRootProps()}
      className="w-full max-w-full mx-auto p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <input
        {...getInputProps()}
        onChange={handleFileChange} // Add onChange handler
      />
      <p className="text-center text-gray-600">
        Drag and drop images here
      </p>
      <button
        type="button"
        onClick={open}
        className="mt-4 px-4 py-2 bg-green-500 transition-all duration-200 hover:bg-green-600 text-white rounded flex mx-auto"
      >
        Select Files
      </button>
      <div className="mt-4 flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div key={index} className="relative w-1/4 p-2 border border-green-500 rounded-xl">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full max-h-[150px] object-contain rounded"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs p-1 rounded-full"
            >
              X
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
