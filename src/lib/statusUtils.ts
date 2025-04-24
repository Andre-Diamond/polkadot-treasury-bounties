/**
 * Utility functions for handling bounty statuses consistently across the application
 */

// Interface for CSS module styles with status classes
export interface StylesType {
    statusActive: string;
    statusPending: string;
    statusAwarded: string;
    statusRejected: string;
    [key: string]: string;
}

// Determine status CSS class based on status string
export const getStatusClass = (status: string, styles: StylesType): string => {
    const statusLower = status.toLowerCase();

    if (['active', 'approved', 'funded', 'becameactive', 'extended'].includes(statusLower)) {
        return styles.statusActive;
    }

    if (['pending', 'proposed'].includes(statusLower)) {
        return styles.statusPending;
    }

    if (['awarded', 'claimed'].includes(statusLower)) {
        return styles.statusAwarded;
    }

    if (['rejected', 'cancelled'].includes(statusLower)) {
        return styles.statusRejected;
    }

    return '';
};

// Format status text for display
export const formatStatus = (status: string): string => {
    if (status.toLowerCase() === 'becameactive') {
        return 'Active';
    }
    return status;
}; 