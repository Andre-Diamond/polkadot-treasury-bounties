import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAllBounties, fetchBountyById, fetchBountiesFromSubscan } from '../services/bountyService';
import type { Bounty } from '../types/bounty';
import type { AccountInfo } from '../types/account';

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds
const ALL_BOUNTIES_CACHE_KEY = 'all_bounties_cache';
const ACTIVE_BOUNTIES_CACHE_KEY = 'active_bounties_cache';
const BOUNTY_DETAIL_CACHE_KEY = 'bounty_detail_cache';
const ACCOUNT_INFO_CACHE_KEY = 'account_info_cache';

interface CacheData<T> {
    timestamp: number;
    data: T;
}

interface NetworkData {
    allBounties: Bounty[];
    activeBounties: Bounty[];
    bountyDetails: Record<string, Bounty>;
    accountInfo: Record<string, AccountInfo>;
}

interface BountyContextType {
    networkData: {
        polkadot: NetworkData;
        kusama: NetworkData;
    };
    isLoading: boolean;
    error: string | null;
    selectedNetwork: 'polkadot' | 'kusama';
    setSelectedNetwork: (network: 'polkadot' | 'kusama') => void;
    fetchAllBountiesData: () => Promise<void>;
    fetchActiveBountiesData: () => Promise<void>;
    fetchBountyDetail: (id: number) => Promise<Bounty | null>;
    fetchAccountInfo: (address: string) => Promise<AccountInfo | null>;
    view: 'active' | 'all';
    setView: (view: 'active' | 'all') => void;
}

const BountyContext = createContext<BountyContextType | undefined>(undefined);

export function BountyProvider({ children }: { children: ReactNode }) {
    const [networkData, setNetworkData] = useState<BountyContextType['networkData']>({
        polkadot: {
            allBounties: [],
            activeBounties: [],
            bountyDetails: {},
            accountInfo: {}
        },
        kusama: {
            allBounties: [],
            activeBounties: [],
            bountyDetails: {},
            accountInfo: {}
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<'polkadot' | 'kusama'>('polkadot');
    const [view, setView] = useState<'active' | 'all'>('active');

    const fetchAllBountiesData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Check cache first
            const cacheKey = `${ALL_BOUNTIES_CACHE_KEY}_${selectedNetwork}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { timestamp, data }: CacheData<Bounty[]> = JSON.parse(cachedData);
                const now = Date.now();

                if (now - timestamp < CACHE_EXPIRY) {
                    setNetworkData(prev => ({
                        ...prev,
                        [selectedNetwork]: {
                            ...prev[selectedNetwork],
                            allBounties: data
                        }
                    }));
                    setIsLoading(false);
                    return;
                }
            }

            // Fetch new data if cache expired or not available
            const data = await fetchAllBounties(selectedNetwork);
            setNetworkData(prev => ({
                ...prev,
                [selectedNetwork]: {
                    ...prev[selectedNetwork],
                    allBounties: data
                }
            }));

            // Update cache
            const cacheData: CacheData<Bounty[]> = {
                timestamp: Date.now(),
                data
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error fetching all bounties:', error);
            setError('Failed to fetch bounties. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchActiveBountiesData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Check cache first
            const cacheKey = `${ACTIVE_BOUNTIES_CACHE_KEY}_${selectedNetwork}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { timestamp, data }: CacheData<Bounty[]> = JSON.parse(cachedData);
                const now = Date.now();

                if (now - timestamp < CACHE_EXPIRY) {
                    setNetworkData(prev => ({
                        ...prev,
                        [selectedNetwork]: {
                            ...prev[selectedNetwork],
                            activeBounties: data
                        }
                    }));
                    setIsLoading(false);
                    return;
                }
            }

            // Fetch new data if cache expired or not available
            const data = await fetchBountiesFromSubscan(selectedNetwork, 0, 'active');
            setNetworkData(prev => ({
                ...prev,
                [selectedNetwork]: {
                    ...prev[selectedNetwork],
                    activeBounties: data
                }
            }));

            // Update cache
            const cacheData: CacheData<Bounty[]> = {
                timestamp: Date.now(),
                data
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error fetching active bounties:', error);
            setError('Failed to fetch bounties. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBountyDetail = async (id: number): Promise<Bounty | null> => {
        const cacheKey = `${BOUNTY_DETAIL_CACHE_KEY}_${id}_${selectedNetwork}`;

        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { timestamp, data }: CacheData<Bounty> = JSON.parse(cachedData);
            const now = Date.now();

            if (now - timestamp < CACHE_EXPIRY) {
                setNetworkData(prev => ({
                    ...prev,
                    [selectedNetwork]: {
                        ...prev[selectedNetwork],
                        bountyDetails: {
                            ...prev[selectedNetwork].bountyDetails,
                            [id]: data
                        }
                    }
                }));
                return data;
            }
        }

        try {
            const data = await fetchBountyById(id, selectedNetwork);
            if (data) {
                setNetworkData(prev => ({
                    ...prev,
                    [selectedNetwork]: {
                        ...prev[selectedNetwork],
                        bountyDetails: {
                            ...prev[selectedNetwork].bountyDetails,
                            [id]: data
                        }
                    }
                }));

                // Update cache
                const cacheData: CacheData<Bounty> = {
                    timestamp: Date.now(),
                    data
                };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching bounty detail:', error);
            return null;
        }
    };

    const fetchAccountInfo = async (address: string): Promise<AccountInfo | null> => {
        const cacheKey = `${ACCOUNT_INFO_CACHE_KEY}_${address}_${selectedNetwork}`;

        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { timestamp, data }: CacheData<AccountInfo> = JSON.parse(cachedData);
            const now = Date.now();

            if (now - timestamp < CACHE_EXPIRY) {
                setNetworkData(prev => ({
                    ...prev,
                    [selectedNetwork]: {
                        ...prev[selectedNetwork],
                        accountInfo: {
                            ...prev[selectedNetwork].accountInfo,
                            [address]: data
                        }
                    }
                }));
                return data;
            }
        }

        try {
            const response = await fetch(`/api/account/${address}?network=${selectedNetwork}`);
            if (!response.ok) {
                throw new Error('Failed to fetch account info');
            }
            const data = await response.json();

            setNetworkData(prev => ({
                ...prev,
                [selectedNetwork]: {
                    ...prev[selectedNetwork],
                    accountInfo: {
                        ...prev[selectedNetwork].accountInfo,
                        [address]: data
                    }
                }
            }));

            // Update cache
            const cacheData: CacheData<AccountInfo> = {
                timestamp: Date.now(),
                data
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            return data;
        } catch (error) {
            console.error('Error fetching account info:', error);
            return null;
        }
    };

    // Fetch data when network changes
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchAllBountiesData(),
                fetchActiveBountiesData()
            ]);
        };
        fetchData();
    }, [selectedNetwork]);

    return (
        <BountyContext.Provider
            value={{
                networkData,
                isLoading,
                error,
                selectedNetwork,
                setSelectedNetwork,
                fetchAllBountiesData,
                fetchActiveBountiesData,
                fetchBountyDetail,
                fetchAccountInfo,
                view,
                setView
            }}
        >
            {children}
        </BountyContext.Provider>
    );
}

export function useBounty() {
    const context = useContext(BountyContext);
    if (context === undefined) {
        throw new Error('useBounty must be used within a BountyProvider');
    }
    return context;
} 