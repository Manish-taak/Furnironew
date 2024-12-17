"use client";

// import Icons from '@/icons/Index';
import React, { useState, useRef, useEffect } from 'react';
import { option, inputselect } from '@/interFaces/interface'; 
import SvgIcon from '../Icons';

/**
 * InputSelect component displays a custom select input with options.
 * @param {inputselect} props - Props object containing input select configuration.
 * @param {string} props.label - Label for the input.
 * @param {string} props.placeholder - Placeholder text for the input.
 * @param {string} props.value - Current value of the input.
 * @param {Function} props.onChange - Function to handle value change.
 * @param {option[]} props.options - Array of options for the select input.
 * @param {string} props.error - Error message to display (optional).
 * @returns {JSX.Element} InputSelect component JSX.
 */
const InputSelect: React.FC<inputselect> = ({ label, placeholder, value, onChange, options, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the dropdown visibility.
   */
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handles selection of an option and closes the dropdown.
   * @param {option} option - Selected option object.
   */
  const handleOptionClick = (option: option) => {
    onChange(option.name);
    setIsOpen(false);
  };

  /**
   * Handles clicks outside the component to close the dropdown.
   * @param {MouseEvent} event - Mouse click event.
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-y-[22px]" ref={containerRef}>
      {label && <p className="heading_16 text-black">{label}</p>}
      <div className="relative">
        <div className={`flex py-[25px] px-[30px] items-center border-[1px] border-[#9f9f9f] ${error && 'border-blue_gray_100'} rounded-[10px]`}>
          <input
            className="text_16_1 outline-none w-full text-border_gray cursor-pointer"
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={handleClick}
            readOnly
          />
          <div
            onClick={handleClick}
            className="cursor-pointer transition-transform duration-300 transform rotate-0"
            style={{ transform: `rotate(${isOpen ? '180deg' : '0deg'})` }}
          >
            {/* <Icons type="downarrow" /> */}
            <SvgIcon name='Downarrow'/>
          </div>
        </div>
        {error && <span className="text-red-600 text-sm">{error}</span>}
        {isOpen && (
          <div className="absolute top-full left-0 z-[40] bg-white w-full shadow-md border border-blue_gray_100 rounded-md mt-1">
            <ul className="list-none p-2">
              {options.map((option) => (
                <li
                  key={option.id}
                  className="cursor-pointer py-[3px] px-1 heading_16 color-border_gray transition-all hover:text-light_primary hover:border-l-[2px] hover:border-light_primary hover:bg-opacity-80"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSelect;
