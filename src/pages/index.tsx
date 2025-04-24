// src/pages/index.tsx
import { useState, useEffect } from 'react';
import { fetchBountiesFromSubscan } from '../services/bountyService';
import type { Bounty } from '../types/bounty';
import styles from '../styles/Bounties.module.css';
import BountyCard from '../components/BountyCard';

const CACHE_KEY = 'polkadot_bounties_cache';
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

interface CacheData {
    timestamp: number;
    data: Bounty[];
}

export default function Home() {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBounties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchBountiesFromSubscan();
            setBounties(data);

            // Update cache
            const cacheData: CacheData = {
                timestamp: Date.now(),
                data
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
        // Check cache on component mount
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, data }: CacheData = JSON.parse(cachedData);
            const now = Date.now();

            if (now - timestamp < CACHE_EXPIRY) {
                setBounties(data);
                return;
            }
        }

        // If no cache or cache expired, fetch new data
        fetchBounties();
    }, []);

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Active Polkadot Treasury Bounties</h1>

            <div className={styles.controls}>
                <button
                    onClick={fetchBounties}
                    disabled={isLoading}
                    className={styles.refreshButton}
                >
                    {isLoading ? 'Loading...' : 'Refresh Bounties'}
                </button>
            </div>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            <div className={styles.cardGrid}>
                {bounties.length > 0 ? (
                    bounties.map((bounty) => (
                        <BountyCard key={bounty.proposal_id} bounty={bounty} />
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
