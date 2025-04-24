// src/services/bountyService.ts
import axios from 'axios';
import type { Bounty } from '../types/bounty';

type SubscanResponse = {
    code: number;
    data: {
        count: number;
        list: Bounty[];
    };
    generated_at: number;
    message: string;
};

export const fetchBountiesFromSubscan = async (page = 0, status = 'active'): Promise<Bounty[]> => {
    try {
        const { data } = await axios.get<SubscanResponse>(
            `/api/bounties?page=${page}&status=${status}`
        );
        return data.data.list;
    } catch (err) {
        console.error('[Service] Failed to fetch Subscan bounties:', err);
        return [];
    }
};

export const fetchAllBounties = async (): Promise<Bounty[]> => {
    try {
        // Fetch both active and historical bounties
        const [activeBounties, historicalBounties] = await Promise.all([
            fetchBountiesFromSubscan(0, 'active'),
            fetchBountiesFromSubscan(0, 'historical')
        ]);

        // Combine the results
        return [...activeBounties, ...historicalBounties];
    } catch (err) {
        console.error('[Service] Failed to fetch all bounties:', err);
        return [];
    }
};