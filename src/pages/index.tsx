// src/pages/index.tsx
import { useState, useEffect } from 'react';
import { fetchBountiesFromSubscan } from '../services/bountyService';
import type { Bounty } from '../types/bounty';
import styles from '../styles/Bounties.module.css';
import BountyCard from '../components/BountyCard';
import NetworkSelector from '../components/NetworkSelector';
import Link from 'next/link';

const CACHE_KEY = 'bounties_cache';
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

interface CacheData {
    timestamp: number;
    data: Bounty[];
    network: 'polkadot' | 'kusama';
}

export default function Home() {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<'polkadot' | 'kusama'>('polkadot');

    const fetchBounties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchBountiesFromSubscan(selectedNetwork);
            setBounties(data);

            // Update cache
            const cacheData: CacheData = {
                timestamp: Date.now(),
                data,
                network: selectedNetwork
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            console.log('Fetched bounties:', data);
        } catch (error) {
            console.error('Error fetching bounties:', error);
            setError('Failed to fetch bounties. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Check cache on component mount or network change
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, data, network }: CacheData = JSON.parse(cachedData);
            const now = Date.now();

            if (now - timestamp < CACHE_EXPIRY && network === selectedNetwork) {
                setBounties(data);
                return;
            }
        }

        // If no cache or cache expired, fetch new data
        fetchBounties();
    }, [selectedNetwork]);

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Active Treasury Bounties</h1>

            <NetworkSelector onNetworkChange={setSelectedNetwork} initialNetwork={selectedNetwork} />

            <div className={styles.controls}>
                <button
                    onClick={fetchBounties}
                    disabled={isLoading}
                    className={styles.refreshButton}
                >
                    {isLoading ? 'Loading...' : 'Refresh Bounties'}
                </button>
                <Link href="/all-bounties" className={styles.allBountiesLink}>
                    View All Bounties
                </Link>
            </div>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            <div className={styles.cardGrid}>
                {bounties.length > 0 ? (
                    bounties.map((bounty) => (
                        <BountyCard key={bounty.proposal_id} bounty={bounty} network={selectedNetwork} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        {isLoading
                            ? 'Loading bounties...'
                            : 'No bounties found. Click refresh to fetch bounties.'}
                    </div>
                )}
            </div>
        </main>
    );
}
