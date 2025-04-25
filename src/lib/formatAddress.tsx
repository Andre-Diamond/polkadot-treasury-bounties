import Identicon from '../components/Identicon';
import React from 'react';

export const formatAddress = (address: string, prefixLength: number = 6, suffixLength: number = 4): React.ReactNode => {
    if (!address || address.length <= prefixLength + suffixLength) {
        return address;
    }
    const formattedAddress = `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
    return (
        <span className="address-with-icon">
            <Identicon address={address} size={32} className="address-icon" />
            <span
                className="address-text"
                style={{
                    color: 'inherit',
                    transition: 'color 0.2s ease'
                }}
            >
                {formattedAddress}
            </span>
        </span>
    );
}; 