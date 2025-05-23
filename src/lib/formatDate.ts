export const formatDate = (timestamp: number): string => {
    if (!timestamp) return '';
    // Convert seconds to milliseconds by multiplying by 1000
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}; 