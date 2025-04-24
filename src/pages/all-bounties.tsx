import { useState, useEffect } from 'react';
import { fetchAllBounties } from '../services/bountyService';
import type { Bounty } from '../types/bounty';
import styles from '../styles/Bounties.module.css';
import BountyCard from '../components/BountyCard';
import Link from 'next/link';

export default function AllBounties() {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBounties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchAllBounties();
            setBounties(data);
            console.log('Fetched all bounties:', data);
        } catch (error) {
            console.error('Error fetching all bounties:', error);
            setError('Failed to fetch bounties. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBounties();
    }, []);

    return (
        <main className={styles.container}>
            <div className={styles.nav}>
                <Link href="/" className={styles.navLink}>
                    ← Back to Active Bounties
                </Link>
            </div>

            <h1 className={styles.title}>All Polkadot Treasury Bounties</h1>
            <p className={styles.subtitle}>Showing both active and historical bounties</p>

            <div className={styles.controls}>
                <button
                    onClick={fetchBounties}
                    disabled={isLoading}
                    className={styles.refreshButton}
                >
                    {isLoading ? 'Loading...' : 'Refresh All Bounties'}
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
                            ? 'Loading all bounties...'
                            : 'No bounties found. Click refresh to fetch bounties.'}
                    </div>
                )}
            </div>
        </main>
    );
} 