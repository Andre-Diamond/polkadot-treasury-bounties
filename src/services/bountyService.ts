// src/services/bountyService.ts
import axios from 'axios';
import type { Bounty } from '../types/bounty';

type SubscanBountiesResponse = {
    code: number;
    data: {
        count: number;
        list: Bounty[];
    };
    generated_at: number;
    message: string;
};

export const fetchBountiesFromSubscan = async (
    network: 'polkadot' | 'kusama' = 'polkadot',
    page = 0,
    status = 'active'
): Promise<Bounty[]> => {
    try {
        const { data } = await axios.get<SubscanBountiesResponse>(
            `/api/bounties?network=${network}&page=${page}&status=${status}`
        );
        return data.data.list;
    } catch (err) {
        console.error('[Service] Failed to fetch Subscan bounties:', err);
        return [];
    }
};

export const fetchAllBounties = async (network: 'polkadot' | 'kusama' = 'polkadot'): Promise<Bounty[]> => {
    try {
        // Fetch both active and historical bounties
        const [activeBounties, historicalBounties] = await Promise.all([
            fetchBountiesFromSubscan(network, 0, 'active'),
            fetchBountiesFromSubscan(network, 0, 'historical')
        ]);

        // Combine the results
        return [...activeBounties, ...historicalBounties];
    } catch (err) {
        console.error('[Service] Failed to fetch all bounties:', err);
        return [];
    }
};

export const fetchBountyById = async (proposalId: number, network: 'polkadot' | 'kusama' = 'polkadot'): Promise<Bounty | null> => {
    try {
        const { data } = await axios.post<{ bounty?: Bounty; error?: string }>(
            '/api/bounty',
            { proposal_id: proposalId, network }
        );

        if (data.error || !data.bounty) {
            throw new Error(data.error || 'Bounty not found');
        }

        return data.bounty;
    } catch (err) {
        console.error('[Service] Failed to fetch bounty details:', err);
        return null;
    }
};