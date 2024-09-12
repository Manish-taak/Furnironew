import React from 'react';
import { UseFormRegister } from 'react-hook-form';

// Define types for component props
interface CommonInputProps {
    label: string;
    type?: 'text' | 'number' | 'email' | 'select'; // Supported input types
    name: string;
    placeholder?: string;
    value?: string;
    options?: string[]; // Options for select type
    register: UseFormRegister<any>; // Register function from react-hook-form
    required?: boolean;
    error?: string; // Error message prop
}

const CommonInput: React.FC<CommonInputProps> = ({
    label,
    type = 'text', // Default input type
    name,
    placeholder = '',
    value = '',
    options = [], // For dropdown inputs
    register,
    required = false,
    error = '', // Error message
}) => {
    const commonProps = {
        ...register(name, { required }),
        placeholder,
        className: error ? 'error' : '',
        required,
    };

    return (
        <div className="common-input">
            <label htmlFor={name}>{label}</label>
            {type === 'select' ? (
                <select
                    id={name}
                    {...commonProps}
                    value={value}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={name}
                    type={type}
                    value={value}
                    {...commonProps}
                />
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};
    
export default CommonInput;
