/**
 * Formats a DOT amount string to a proper decimal representation
 * Polkadot uses 10 decimals, so we need to convert from Planck to DOT
 * 
 * @param value The value as a string from the API
 * @returns Formatted DOT amount with proper decimals and currency symbol
 */
export function formatDOTAmount(value: string): string {
    // DOT has 10 decimal places
    const DOT_DECIMALS = 10;

    try {
        // Parse the string to a BigInt to handle large numbers
        const planck = BigInt(value);

        // Convert to DOT (divide by 10^10)
        const dotValue = Number(planck) / Math.pow(10, DOT_DECIMALS);

        // Format with proper separators and fixed decimal places
        return `${dotValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        })} DOT`;
    } catch (error) {
        console.error('Error formatting DOT amount:', error);
        return `${value} Planck`;
    }
} 