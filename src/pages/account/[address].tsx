import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/AccountDetail.module.css';
import { networks } from '../../config/networks';
import { useBounty } from '../../context/BountyContext';
import { formatTokenAmount } from '../../lib/format';
import { formatAddress } from '../../lib/formatAddress';
import Identicon from '../../components/Identicon';
import type { AccountInfo, AccountResponse } from '../../types/account';

const formatBalance = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(3);
};

export default function AccountDetailPage() {
    const router = useRouter();
    const { address } = router.query;
    const {
        networkData,
        selectedNetwork,
        fetchAccountInfo,
        isLoading,
        error
    } = useBounty();

    const [account, setAccount] = useState<AccountInfo | null>(null);

    useEffect(() => {
        if (!address) return;

        const getAccountInfo = async () => {
            if (networkData[selectedNetwork].accountInfo[address as string]) {
                const cachedData = networkData[selectedNetwork].accountInfo[address as string] as unknown as AccountResponse;
                console.log('Account data:', cachedData);
                setAccount(cachedData.account);
                return;
            }

            const data = await fetchAccountInfo(address as string) as unknown as AccountResponse;
            if (data) {
                console.log('Account data:', data);
                setAccount(data.account);
            }
        };

        getAccountInfo();
    }, [address, selectedNetwork, networkData]);

    if (!account) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    Loading account details...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <div className={styles.networkDisplay}>
                    {networks[selectedNetwork].name}
                </div>
            </div>

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    Loading account details...
                </div>
            )}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.accountDetail}>
                <header className={styles.header}>
                    <div className={styles.titleContainer}>
                        <Identicon address={account.address} size={40} className={styles.identicon} />
                        <h1 className={styles.title}>
                            {account.display || 'Unknown Account'}
                        </h1>
                    </div>
                    <div className={styles.address} title={account.address}>
                        {formatAddress(account.address)}
                    </div>
                </header>

                <div className={styles.twoColGrid}>
                    <div className={styles.mainContent}>
                        <div className={styles.balanceCard}>
                            <h2 className={styles.sectionTitle}>Balance</h2>
                            <div className={styles.balanceGrid}>
                                <div className={styles.balanceItem}>
                                    <span className={styles.balanceLabel}>Free Balance</span>
                                    <div className={styles.balanceValue}>{formatBalance(account.balance)}</div>
                                </div>
                                <div className={styles.balanceItem}>
                                    <span className={styles.balanceLabel}>Reserved</span>
                                    <div className={styles.balanceValue} title={formatTokenAmount(account.reserved.toString(), selectedNetwork)}>
                                        {formatTokenAmount(account.reserved.toString(), selectedNetwork)}
                                    </div>
                                </div>
                                <div className={styles.balanceItem}>
                                    <span className={styles.balanceLabel}>Bonded</span>
                                    <div className={styles.balanceValue}>{formatBalance(account.bonded)}</div>
                                </div>
                                <div className={styles.balanceItem}>
                                    <span className={styles.balanceLabel}>Unbonding</span>
                                    <div className={styles.balanceValue}>{formatBalance(account.unbonding)}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.accountInfoCard}>
                            <h2 className={styles.sectionTitle}>Account Info</h2>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Nonce</span>
                                    <div className={styles.infoValue}>{account.nonce}</div>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Extrinsic Count</span>
                                    <div className={styles.infoValue}>{account.count_extrinsic}</div>
                                </div>
                                <div className={styles.badges}>
                                    {account.is_council_member && (
                                        <div className={styles.badge}>Council Member</div>
                                    )}
                                    {account.is_techcomm_member && (
                                        <div className={styles.badge}>Technical Committee Member</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {account.multisig?.multi_account && account.multisig.multi_account.length > 0 && (
                            <div className={styles.multisigCard}>
                                <h2 className={styles.sectionTitle}>Multisig Account</h2>
                                <div className={styles.multisigGrid}>
                                    {account.multisig.multi_account.map((signer, index) => (
                                        <div key={index} className={styles.signer}>
                                            <span className={styles.signerLabel}>Signer {index + 1}</span>
                                            <Link href={`/account/${signer.address}`} className={styles.signerLink} title={signer.address}>
                                                {formatAddress(signer.address)}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <h2 className={styles.sectionTitle}>Identity</h2>
                            <div className={styles.identityGrid}>
                                {account.account_display?.identity && (
                                    <div className={styles.verified}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        Verified Identity
                                    </div>
                                )}
                                {account.judgements && account.judgements.length > 0 && (
                                    <div className={styles.judgements}>
                                        <span className={styles.judgementsLabel}>Identity Judgement</span>
                                        <div className={styles.judgementsList}>
                                            {account.judgements.map((judgement, index) => (
                                                <div key={index} className={styles.judgementItem}>
                                                    {judgement.judgement} (Index: {judgement.index})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.sidebarCard}>
                            <h2 className={styles.sectionTitle}>Social & Contact</h2>
                            <div className={styles.socialGrid}>
                                {account.twitter && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Twitter</span>
                                        <div className={styles.socialValue}>{account.twitter}</div>
                                    </div>
                                )}
                                {account.matrix && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Matrix</span>
                                        <div className={styles.socialValue}>{account.matrix}</div>
                                    </div>
                                )}
                                {account.discord && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Discord</span>
                                        <div className={styles.socialValue}>{account.discord}</div>
                                    </div>
                                )}
                                {account.github && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>GitHub</span>
                                        <div className={styles.socialValue}>{account.github}</div>
                                    </div>
                                )}
                                {account.riot && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Riot</span>
                                        <div className={styles.socialValue}>{account.riot}</div>
                                    </div>
                                )}
                                {account.email && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Email</span>
                                        <div className={styles.socialValue}>{account.email}</div>
                                    </div>
                                )}
                                {account.web && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Website</span>
                                        <div className={styles.socialValue}>{account.web}</div>
                                    </div>
                                )}
                                {account.legal && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Legal</span>
                                        <div className={styles.socialValue}>{account.legal}</div>
                                    </div>
                                )}
                                {account.role && (
                                    <div className={styles.socialItem}>
                                        <span className={styles.socialLabel}>Role</span>
                                        <div className={styles.socialValue}>{account.role}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 