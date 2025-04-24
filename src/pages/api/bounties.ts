// src/pages/api/bounties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import type { Bounty } from '../../types/bounty';
import { formatDOTAmount } from '../../lib/format';

const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY!;
const BASE_URL = 'https://polkadot.api.subscan.io/api';

type SubscanError = {
    message: string;
    code: number;
};

type SubscanResponse = {
    code: number;
    data: {
        count: number;
        list: Bounty[];
    };
    generated_at: number;
    message: string;
};

type BountyStatus = 'historical' | 'active';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SubscanResponse | { error?: string }>
) {
    try {
        const page = parseInt((req.query.page as string) || '0', 10);
        const status = (req.query.status as BountyStatus) || 'active';

        const { data } = await axios.post<SubscanResponse>(
            `${BASE_URL}/scan/bounties/proposals`,
            {
                row: 100,
                page,
                status
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': SUBSCAN_API_KEY,
                },
            }
        );

        // Format DOT amounts for all bounties
        if (data.data && data.data.list) {
            data.data.list = data.data.list.map(bounty => ({
                ...bounty,
                value: formatDOTAmount(bounty.value)
            }));
        }

        res.status(200).json(data);
    } catch (err) {
        const error = err as AxiosError<SubscanError>;
        console.error('Subscan API error:', error.response?.data || error.message);
        res
            .status(error.response?.status || 500)
            .json({ error: error.response?.data?.message || error.message });
    }
}
