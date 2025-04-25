import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/AccountDetail.module.css';
import { networks } from '../../config/networks';
import { useBounty } from '../../context/BountyContext';
import type { AccountInfo, AccountResponse } from '../../types/account';

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
                console.log('Cached account data:', cachedData);
                setAccount(cachedData.account);
                return;
            }

            const data = await fetchAccountInfo(address as string) as unknown as AccountResponse;
            console.log('Fetched account data:', data);
            if (data) {
                setAccount(data.account);
            }
        };

        getAccountInfo();
    }, [address, selectedNetwork, networkData]);

    if (!account) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading account details...</div>
            </div>
        );
    }

    // Debug the account data structure
    console.log('Account data in render:', account);
    console.log('Account display:', account.account_display);
    console.log('Account display people:', account.account_display?.people);
    console.log('Account judgements:', account.judgements);
    console.log('Account multisig:', account.multisig);

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

            {isLoading && <div className={styles.loading}>Loading account details...</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.accountDetail}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {account.display || 'Unknown Account'}
                    </h1>
                    <div className={styles.address}>{account.address}</div>
                </header>

                <div className={styles.twoColGrid}>
                    <div className={styles.mainContent}>
                        <div className={styles.balanceCard}>
                            <h2 className={styles.sectionTitle}>Balance</h2>
                            <div className={styles.balanceGrid}>
                                <div>
                                    <span>Free Balance</span>
                                    <div>{account.balance}</div>
                                </div>
                                <div>
                                    <span>Reserved</span>
                                    <div>{account.reserved}</div>
                                </div>
                                <div>
                                    <span>Bonded</span>
                                    <div>{account.bonded}</div>
                                </div>
                                <div>
                                    <span>Unbonding</span>
                                    <div>{account.unbonding}</div>
                                </div>
                            </div>
                        </div>

                        {account.multisig?.multi_account && account.multisig.multi_account.length > 0 && (
                            <div className={styles.multisigCard}>
                                <h2 className={styles.sectionTitle}>Multisig Account</h2>
                                <div className={styles.multisigGrid}>
                                    {account.multisig.multi_account.map((signer, index) => (
                                        <div key={index} className={styles.signer}>
                                            <span>Signer {index + 1}</span>
                                            <Link href={`/account/${signer.address}`} className={styles.signerLink}>
                                                {signer.address}
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        Verified Identity
                                    </div>
                                )}
                                {account.judgements && account.judgements.length > 0 && (
                                    <div>
                                        <span>Identity Judgement</span>
                                        <div>
                                            {account.judgements.map((judgement, index) => (
                                                <div key={index}>
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
                                    <div>
                                        <span>Twitter</span>
                                        <div>{account.twitter}</div>
                                    </div>
                                )}
                                {account.matrix && (
                                    <div>
                                        <span>Matrix</span>
                                        <div>{account.matrix}</div>
                                    </div>
                                )}
                                {account.email && (
                                    <div>
                                        <span>Email</span>
                                        <div>{account.email}</div>
                                    </div>
                                )}
                                {account.web && (
                                    <div>
                                        <span>Website</span>
                                        <div>{account.web}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.sidebarCard}>
                            <h2 className={styles.sectionTitle}>Account Info</h2>
                            <div className={styles.infoGrid}>
                                <div>
                                    <span>Nonce</span>
                                    <div>{account.nonce}</div>
                                </div>
                                <div>
                                    <span>Extrinsic Count</span>
                                    <div>{account.count_extrinsic}</div>
                                </div>
                                {account.is_council_member && (
                                    <div className={styles.badge}>Council Member</div>
                                )}
                                {account.is_techcomm_member && (
                                    <div className={styles.badge}>Technical Committee Member</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 