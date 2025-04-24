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

export const fetchBountiesFromSubscan = async (page = 0): Promise<Bounty[]> => {
    try {
        const { data } = await axios.get<SubscanResponse>(
            `/api/bounties?page=${page}`
        );
        return data.data.list;
    } catch (err) {
        console.error('[Service] Failed to fetch Subscan bounties:', err);
        return [];
    }
};