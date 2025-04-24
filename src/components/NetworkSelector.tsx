import { useState, useEffect } from 'react';
import { networks } from '../config/networks';
import styles from '../styles/NetworkSelector.module.css';

interface NetworkSelectorProps {
    onNetworkChange: (network: 'polkadot' | 'kusama') => void;
    initialNetwork?: 'polkadot' | 'kusama';
}

export default function NetworkSelector({ onNetworkChange, initialNetwork = 'polkadot' }: NetworkSelectorProps) {
    const [selectedNetwork, setSelectedNetwork] = useState<'polkadot' | 'kusama'>(initialNetwork);

    useEffect(() => {
        onNetworkChange(selectedNetwork);
    }, [selectedNetwork, onNetworkChange]);

    return (
        <div className={styles.container}>
            <div className={styles.selector}>
                {Object.entries(networks).map(([key, network]) => (
                    <button
                        key={key}
                        className={`${styles.networkButton} ${selectedNetwork === key ? styles.active : ''}`}
                        onClick={() => setSelectedNetwork(key as 'polkadot' | 'kusama')}
                    >
                        {network.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
