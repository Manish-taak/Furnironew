import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using `clsx` and merges Tailwind CSS classes with `twMerge`.
 *
 * @param {Array<string | undefined | null | false>} inputs - Class names or conditions for class names.
 * @returns {string} - The combined and merged class names.
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return twMerge(clsx(...inputs));
}
