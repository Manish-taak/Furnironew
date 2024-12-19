import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Utility function to merge conditional Tailwind CSS class names.
 * Uses clsx to handle conditional classnames and twMerge to merge conflicting ones.
 * 
 * @param inputs - A variable number of class values (strings, arrays, objects, etc.)
 * @returns A merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
    // clsx combines class names conditionally, and twMerge ensures proper handling of conflicting Tailwind classes
    return twMerge(clsx(inputs));
}

/**
 * Formats a date string into 'DD-MM-YYYY' format.
 * 
 * @param dateString - The input date string.
 * @returns A formatted date string in 'DD-MM-YYYY' format.
 */
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB").format(date);
};
