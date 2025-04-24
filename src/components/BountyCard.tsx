import React from 'react';
import styles from '../styles/Bounties.module.css';
import type { Bounty } from '../types/bounty';

interface BountyCardProps {
    bounty: Bounty;
}

// Helper function to determine status class
const getStatusClass = (status: string): string => {
    if (status.toLowerCase().includes('active')) return styles.statusActive;
    if (status.toLowerCase().includes('pending')) return styles.statusPending;
    return '';
};

const BountyCard: React.FC<BountyCardProps> = ({ bounty }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.bountyId}>#{bounty.proposal_id}</div>
                <div className={styles.bountyTitle}>{bounty.title}</div>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.bountyProposer}>
                    <span>Proposer:</span> {bounty.proposer.display || bounty.proposer.address}
                </div>
                <div className={styles.bountyDescription}>
                    {bounty.description.length > 120
                        ? `${bounty.description.substring(0, 120)}...`
                        : bounty.description}
                </div>
            </div>
            <div className={styles.cardFooter}>
                <div className={styles.bountyValue}>{bounty.value}</div>
                <div>
                    <span className={`${styles.bountyStatus} ${getStatusClass(bounty.status)}`}>
                        {bounty.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BountyCard; 