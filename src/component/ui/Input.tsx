"use client";

import React, { forwardRef } from "react";
import { inputtype } from "@/interFaces/interface";
import { cn } from "@/app/utils/cn";

/**
 * Input component renders an HTML input element with optional features like
 * showing or hiding input values and displaying error messages.
 * @param {inputtype} props - Props for configuring the Input component.
 * @param {string} props.type - Type of input element (e.g., text, password).
 * @param {string} props.name - Name attribute of the input element.
 * @param {string} props.id - Unique identifier for the input element.
 * @param {string} props.inputclass - Additional CSS classes for the input element.
 * @param {string} props.placeholder - Placeholder text for the input element.
 * @param {string} props.className - Additional CSS classes for the label element.
 * @param {string} props.inputparent - CSS classes for the input parent container.
 * @param {boolean} props.show - Flag to show/hide additional content (e.g., password).
 * @param {boolean} props.showtype - Type of content to show (e.g., password).
 * @param {Function} props.setshow - Function to toggle the visibility of additional content.
 * @param {string} props.label - Label text for the input element.
 * @param {string} props.error - Error message to display.
 * @param {any} rest - Additional props to be spread to the input element.
 * @param {React.Ref<HTMLInputElement>} ref - Ref forwarding for the input element.
 * @returns {JSX.Element} Input component UI.
 */
const Input = forwardRef<HTMLInputElement, inputtype>(({
  type,
  name,
  id,
  inputclass,
  placeholder,
  className,
  inputparent,
  show,
  showtype,
  setshow,
  label,
  error,
  ...rest
}, ref) => {
  return (
    <>
      {/* Input label */}
      <label className={` ${className} flex flex-col gap-y-[22px]`}>
        <p className="heading_16 capitalize">{label}</p>
        <div
          className={`relative w-full ${inputparent} flex justify-between items-center rounded-md`}
        >
          {/* Input field */}
          <input
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            className={`${inputclass} border-[1px] border-[#9F9F9F] w-full py-[25px] px-[30px] text-base leading-6 text-[#9F9F9F] outline-none rounded-[10px]`}
            ref={ref}
            {...rest}
          />
          {/* Show/Hide toggle */}
          {show && setshow && (
            <span
              onClick={() => setshow(!showtype)}
              className="text-light_primary cursor-pointer"
            >
              {showtype ? "Hide" : " Show"}
            </span>
          )}
        </div>
        {/* Error message */}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </label>
    </>
  );
});

export default Input;
