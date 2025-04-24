import { useState, useEffect } from 'react';
import { networks } from '../config/networks';
import styles from '../styles/NetworkViewSelector.module.css';

interface NetworkViewSelectorProps {
    onNetworkChange: (network: 'polkadot' | 'kusama') => void;
    onViewChange: (view: 'active' | 'all') => void;
    initialNetwork?: 'polkadot' | 'kusama';
    initialView?: 'active' | 'all';
}

export default function NetworkViewSelector({
    onNetworkChange,
    onViewChange,
    initialNetwork = 'polkadot',
    initialView = 'active'
}: NetworkViewSelectorProps) {
    const [selectedNetwork, setSelectedNetwork] = useState<'polkadot' | 'kusama'>(initialNetwork);
    const [selectedView, setSelectedView] = useState<'active' | 'all'>(initialView);

    useEffect(() => {
        onNetworkChange(selectedNetwork);
    }, [selectedNetwork, onNetworkChange]);

    useEffect(() => {
        onViewChange(selectedView);
    }, [selectedView, onViewChange]);

    return (
        <div className={styles.container}>
            <div className={styles.selector}>
                {Object.entries(networks).map(([key, network]) => (
                    <button
                        key={key}
                        className={`${styles.button} ${selectedNetwork === key ? styles.active : ''}`}
                        onClick={() => setSelectedNetwork(key as 'polkadot' | 'kusama')}
                    >
                        {network.name}
                    </button>
                ))}
            </div>
            <div className={styles.selector}>
                <button
                    className={`${styles.button} ${selectedView === 'active' ? styles.active : ''}`}
                    onClick={() => setSelectedView('active')}
                >
                    Active
                </button>
                <button
                    className={`${styles.button} ${selectedView === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedView('all')}
                >
                    All
                </button>
            </div>
        </div>
    );
} 