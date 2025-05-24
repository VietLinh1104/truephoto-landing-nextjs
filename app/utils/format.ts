import { ReactNode } from 'react';

/**
 * Format text by replacing escaped newlines with actual newlines
 * @param text - The text to format, can be string or ReactNode
 * @returns Formatted text
 */
export const formatDescription = (text: ReactNode): ReactNode => {
    if (typeof text === 'string') {
        return text.replace(/\\n/g, '\n');
    }
    return text;
}; 