'use client'

import React, { useState } from 'react';

interface Option {
  id: string;
  name: string;
  values: string[];
}

const ProductVariation: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([
    { id: '1', name: 'Option 1', values: ['Value 1', 'Value 2'] },
    { id: '2', name: 'Option 2', values: ['Value 1', 'Value 2'] },
    { id: '3', name: 'Option 3', values: ['Value 1', 'Value 2'] },
  ]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
    event.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    event.preventDefault();
    const dragIndex = Number(event.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const updatedOptions = Array.from(options);
    const [draggedItem] = updatedOptions.splice(dragIndex, 1);
    updatedOptions.splice(dropIndex, 0, draggedItem);

    setOptions(updatedOptions);
    event.currentTarget.classList.remove('drag-over');
    document.querySelector('.dragging')?.classList.remove('dragging');
  };

  const updateOptionName = (index: number, newName: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].name = newName;
    setOptions(updatedOptions);
  };

  const updateOptionValue = (index: number, valueIndex: number, newValue: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].values[valueIndex] = newValue;
    setOptions(updatedOptions);
  };

  const removeOptionValue = (index: number, valueIndex: number) => {
    const updatedOptions = [...options];
    updatedOptions[index].values.splice(valueIndex, 1);
    setOptions(updatedOptions);
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <div
          key={option.id}
          draggable
          onDragStart={(event) => handleDragStart(event, index)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(event) => handleDrop(event, index)}
          className="p-4 bg-gray-200 border rounded cursor-pointer select-none"
        >
          <input
            value={option.name}
            onChange={(e) => updateOptionName(index, e.target.value)}
            placeholder="Option name"
            className="block w-full mb-2 border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
          />
          {option.values.map((value, valueIndex) => (
            <div key={valueIndex} className="flex items-center space-x-2 mb-2">
              <input
                value={value}
                onChange={(e) => updateOptionValue(index, valueIndex, e.target.value)}
                placeholder={`Value ${valueIndex + 1}`}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
              />
              <button
                type="button"
                onClick={() => removeOptionValue(index, valueIndex)}
                className="text-red-500 underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => removeOption(index)}
            className="text-red-500 underline"
          >
            Remove Option
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductVariation;
