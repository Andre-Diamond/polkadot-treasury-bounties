import { networks } from '../config/networks';

/**
 * Formats a token amount string to a proper decimal representation
 * 
 * @param value The value as a string from the API
 * @param network The network to use for formatting (defaults to polkadot)
 * @returns Formatted amount with proper decimals and currency symbol
 */
export function formatTokenAmount(value: string, network: 'polkadot' | 'kusama' = 'polkadot'): string {
    const { decimals, symbol } = networks[network];

    try {
        // Parse the string to a BigInt to handle large numbers
        const planck = BigInt(value);

        // Convert to token (divide by 10^decimals)
        const tokenValue = Number(planck) / Math.pow(10, decimals);

        // Format with proper separators and fixed decimal places
        return `${tokenValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        })} ${symbol}`;
    } catch (error) {
        console.error('Error formatting token amount:', error);
        return `${value} Planck`;
    }
} 