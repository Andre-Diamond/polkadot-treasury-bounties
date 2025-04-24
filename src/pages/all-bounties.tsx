import styles from '../styles/Bounties.module.css';
import BountyCard from '../components/BountyCard';
import NetworkSelector from '../components/NetworkSelector';
import Link from 'next/link';
import { useBounty } from '../context/BountyContext';

export default function AllBounties() {
    const {
        networkData,
        isLoading,
        error,
        selectedNetwork,
        setSelectedNetwork,
        fetchAllBountiesData
    } = useBounty();

    const allBounties = networkData[selectedNetwork].allBounties;

    return (
        <main className={styles.container}>
            <div className={styles.nav}>
                <Link href="/" className={styles.navLink}>
                    ← Back to Active Bounties
                </Link>
            </div>

            <h1 className={styles.title}>All Polkadot Treasury Bounties</h1>
            <p className={styles.subtitle}>Showing both active and historical bounties</p>

            <NetworkSelector onNetworkChange={setSelectedNetwork} initialNetwork={selectedNetwork} />

            <div className={styles.controls}>
                <button
                    onClick={fetchAllBountiesData}
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
                {allBounties.length > 0 ? (
                    allBounties.map((bounty) => (
                        <BountyCard
                            key={bounty.proposal_id}
                            bounty={bounty}
                            network={selectedNetwork}
                        />
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