import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';
import { networks } from '../config/networks';
import { useBounty } from '../context/BountyContext';
import NetworkViewSelector from './NetworkViewSelector';

export default function Navbar() {
    const router = useRouter();
    const { selectedNetwork, setSelectedNetwork, view, setView } = useBounty();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <div className={styles.leftSection}>
                    <Link href="/" className={styles.logo}>
                        Treasury Bounties
                    </Link>
                </div>

                <div className={styles.rightSection}>
                    {router.pathname === '/' ? (
                        <div className={styles.controls}>
                            <NetworkViewSelector
                                onNetworkChange={setSelectedNetwork}
                                onViewChange={setView}
                                initialNetwork={selectedNetwork}
                                initialView={view}
                            />
                        </div>
                    ) : (
                        <>
                            <div className={styles.networkDisplay}>
                                {networks[selectedNetwork].name}
                            </div>
                            <button
                                onClick={() => router.back()}
                                className={styles.backButton}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
} 