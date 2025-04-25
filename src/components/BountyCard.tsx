import React from 'react';
import styles from '../styles/Bounties.module.css';
import type { Bounty } from '../types/bounty';
import { useRouter } from 'next/router';
import { getStatusClass, formatStatus, StylesType } from '../lib/statusUtils';
import { formatAddress as formatAddressWithIcon } from '../lib/formatAddress';
import { formatDate } from '../lib/formatDate';

interface BountyCardProps {
    bounty: Bounty;
    network: 'polkadot' | 'kusama';
}

// Helper function to format address
const formatAddress = (address: string): React.ReactNode => {
    if (!address) return '';
    return formatAddressWithIcon(address);
};

const BountyCard: React.FC<BountyCardProps> = ({ bounty, network }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/bounty/${bounty.proposal_id}?network=${network}`);
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.cardHeader}>
                <div className={styles.bountyId}>#{bounty.proposal_id}</div>
                <div className={styles.bountyTitle}>{bounty.title}</div>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.bountyProposer}>
                    <span>Proposer:</span> {bounty.proposer.display || formatAddress(bounty.proposer.address)}
                </div>
                {bounty.block_timestamp && (
                    <div className={styles.bountyDate}>
                        <span>Proposed:</span> {formatDate(bounty.block_timestamp)}
                    </div>
                )}
            </div>
            <div className={styles.cardFooter}>
                <div className={styles.bountyValue}>{bounty.value}</div>
                <div>
                    <span className={`${styles.bountyStatus} ${getStatusClass(bounty.status, styles as StylesType)}`}>
                        {formatStatus(bounty.status)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BountyCard; 