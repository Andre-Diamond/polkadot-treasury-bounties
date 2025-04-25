import React from 'react';
import { polkadotIcon } from '@polkadot/ui-shared';

interface IdenticonProps {
    address: string;
    size?: number;
    className?: string;
}

export const Identicon: React.FC<IdenticonProps> = ({ address, size = 32, className = '' }) => {
    if (!address) return null;

    const circles = polkadotIcon(address, { isAlternative: false });
    const transform = `scale(${size / 64})`;

    return (
        <svg
            className={className}
            height={size}
            width={size}
            viewBox="0 0 64 64"
            style={{ transform }}
        >
            {circles.map(({ cx, cy, fill, r }, key) => (
                <circle
                    key={key}
                    cx={cx}
                    cy={cy}
                    fill={fill}
                    r={r}
                />
            ))}
        </svg>
    );
};

export default Identicon; 