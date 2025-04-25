// src/pages/index.tsx
import styles from '../styles/Bounties.module.css';
import BountyCard from '../components/BountyCard';
import { useBounty } from '../context/BountyContext';

export default function Home() {
    const {
        networkData,
        isLoading,
        error,
        selectedNetwork,
        view
    } = useBounty();

    const bounties = view === 'active'
        ? networkData[selectedNetwork].activeBounties
        : networkData[selectedNetwork].allBounties;

    return (
        <main className={styles.container}>

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
