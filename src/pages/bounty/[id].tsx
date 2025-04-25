import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/BountyDetail.module.css';
import { formatTokenAmount } from '../../lib/format';
import { formatAddress as formatAddressWithIcon } from '../../lib/formatAddress';
import { getStatusClass, formatStatus, StylesType } from '../../lib/statusUtils';
import { networks } from '../../config/networks';
import { useBounty } from '../../context/BountyContext';
import type { Bounty } from '../../types/bounty';

export default function BountyDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const {
        networkData,
        selectedNetwork,
        fetchBountyDetail,
        isLoading,
        error
    } = useBounty();

    const [bounty, setBounty] = useState<Bounty | null>(null);

    useEffect(() => {
        if (!id) return;

        const getBountyDetails = async () => {
            const proposalId = parseInt(id as string, 10);
            // Check if we already have the bounty in context
            if (networkData[selectedNetwork].bountyDetails[proposalId]) {
                setBounty(networkData[selectedNetwork].bountyDetails[proposalId]);
                return;
            }

            // Fetch bounty if not in context
            const data = await fetchBountyDetail(proposalId);
            if (data) {
                setBounty(data);
            }
        };

        getBountyDetails();
    }, [id, selectedNetwork, networkData]);

    // Helper function to format date
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'Unknown';
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    // Helper function to format address
    const formatAddress = (address: string): React.ReactNode => {
        if (!address) return '';
        return (
            <Link href={`/account/${address}?network=${selectedNetwork}`} className={styles.accountLink}>
                {formatAddressWithIcon(address)}
            </Link>
        );
    };

    // Helper function to format token values
    const formatTokenValue = (value: string): React.ReactNode => {
        if (!value) return '';
        if (value.includes(networks[selectedNetwork].symbol)) return value;
        const formattedValue = formatTokenAmount(value, selectedNetwork);
        return (
            <span className={styles.dotValue}>{formattedValue}</span>
        );
    };

    // Verified identity icon component
    const VerifiedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginLeft: '4px' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </Link>
                <div className={styles.networkDisplay}>
                    {networks[selectedNetwork].name}
                </div>
            </div>

            {isLoading && <div className={styles.loading}>Loading bounty details...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {bounty && (
                <div className={styles.bountyDetail}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>
                            <span className={styles.bountyId}>#{bounty.proposal_id}</span>
                            {bounty.title}
                        </h1>
                        <div className={`${styles.status} ${getStatusClass(bounty.status, styles as StylesType)}`}>
                            {formatStatus(bounty.status)}
                        </div>
                    </header>

                    <div className={styles.twoColGrid}>
                        <div className={styles.mainContent}>
                            <div className={styles.metadataCard}>
                                <div className={styles.value}>{formatTokenValue(bounty.value)}</div>
                                <div className={styles.metadataGrid}>
                                    {bounty.bond && (
                                        <div>
                                            <span>Bond</span>
                                            <div>{formatTokenValue(bounty.bond)}</div>
                                        </div>
                                    )}
                                    {(bounty.block_timestamp || bounty.created_block) && (
                                        <div>
                                            <span>Created</span>
                                            <div>{formatDate(bounty.block_timestamp || (bounty.created_block ? bounty.created_block : undefined))}</div>
                                        </div>
                                    )}
                                    {bounty.expire_block && (
                                        <div>
                                            <span>Expiry</span>
                                            <div>{bounty.expire_block}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.detailCard}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    Description
                                </h2>
                                <div className={styles.description}>
                                    <p>{bounty.description}</p>
                                </div>
                            </div>

                            {bounty.timeline && bounty.timeline.length > 0 && (
                                <div className={styles.detailCard}>
                                    <h2 className={styles.sectionTitle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        Timeline
                                    </h2>
                                    <div className={styles.timelineContainer}>
                                        {bounty.timeline.map((item, index) => (
                                            <div key={`${item.block}-${index}`} className={styles.timelineItem}>
                                                <div className={styles.timelineStatus}>{item.status}</div>
                                                <div className={styles.timelineDate}>
                                                    {formatDate(item.time)}
                                                </div>
                                                <div className={styles.timelineBlock}>
                                                    Block: {item.block}
                                                    {item.extrinsic_index && ` | Extrinsic: ${item.extrinsic_index}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.sidebar}>
                            <div className={styles.sidebarCard}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Proposer
                                </h2>
                                <div className={styles.accountInfo}>
                                    <div className={styles.accountName}>
                                        {bounty.proposer.people.display || 'Unknown'}
                                        {bounty.proposer.identity && <VerifiedIcon />}
                                    </div>
                                    <div className={styles.accountAddress}>{formatAddress(bounty.proposer.address)}</div>
                                    {bounty.proposer.account_index && (
                                        <div className={styles.accountIndex}>{bounty.proposer.account_index}</div>
                                    )}
                                </div>
                            </div>

                            {bounty.curator && (
                                <div className={styles.sidebarCard}>
                                    <h2 className={styles.sectionTitle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <line x1="20" y1="8" x2="20" y2="14"></line>
                                            <line x1="23" y1="11" x2="17" y2="11"></line>
                                        </svg>
                                        Curator
                                    </h2>
                                    <div className={styles.accountInfo}>
                                        <div className={styles.accountName}>
                                            {bounty.curator.people.display || 'Unknown'}
                                            {bounty.curator.identity && <VerifiedIcon />}
                                        </div>
                                        <div className={styles.accountAddress}>{formatAddress(bounty.curator.address)}</div>
                                        {bounty.curator.account_index && (
                                            <div className={styles.accountIndex}>{bounty.curator.account_index}</div>
                                        )}

                                        <div className={styles.curatorInfo}>
                                            {bounty.curator_fee && (
                                                <div><span>Fee</span> {formatTokenValue(bounty.curator_fee)}</div>
                                            )}
                                            {bounty.curator_deposit && (
                                                <div><span>Deposit</span> {formatTokenValue(bounty.curator_deposit)}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {bounty.beneficiary && (
                                <div className={styles.sidebarCard}>
                                    <h2 className={styles.sectionTitle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                        </svg>
                                        Beneficiary
                                    </h2>
                                    <div className={styles.accountInfo}>
                                        <div className={styles.accountName}>
                                            {bounty.beneficiary.display || 'Unknown'}
                                            {bounty.beneficiary.identity && <VerifiedIcon />}
                                        </div>
                                        <div className={styles.accountAddress}>{formatAddress(bounty.beneficiary.address)}</div>
                                        {bounty.beneficiary.account_index && (
                                            <div className={styles.accountIndex}>{bounty.beneficiary.account_index}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 