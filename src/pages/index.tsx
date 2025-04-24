// src/pages/index.tsx
import styles from '../styles/Bounties.module.css';
import BountyCard from '../components/BountyCard';
import NetworkSelector from '../components/NetworkSelector';
import Link from 'next/link';
import { useBounty } from '../context/BountyContext';

export default function Home() {
    const {
        networkData,
        isLoading,
        error,
        selectedNetwork,
        setSelectedNetwork,
        fetchActiveBountiesData
    } = useBounty();

    const activeBounties = networkData[selectedNetwork].activeBounties;

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Active Treasury Bounties</h1>

            <NetworkSelector onNetworkChange={setSelectedNetwork} initialNetwork={selectedNetwork} />

            <div className={styles.controls}>
                <button
                    onClick={fetchActiveBountiesData}
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
                {activeBounties.length > 0 ? (
                    activeBounties.map((bounty) => (
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
