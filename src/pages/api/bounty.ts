import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import type { Bounty, SubscanBountyResponse } from '../../types/bounty';
import { formatDOTAmount } from '../../lib/format';

const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY!;
const BASE_URL = 'https://polkadot.api.subscan.io/api';

type SubscanError = {
    message: string;
    code: number;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ bounty?: Bounty; error?: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { proposal_id } = req.body;

        if (!proposal_id) {
            return res.status(400).json({ error: 'proposal_id is required' });
        }

        const { data } = await axios.post<SubscanBountyResponse>(
            `${BASE_URL}/scan/bounties/proposal`,
            {
                proposal_id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': SUBSCAN_API_KEY,
                },
            }
        );

        // Format the DOT amount for the bounty
        if (data.data) {
            data.data.value = formatDOTAmount(data.data.value);
        }

        res.status(200).json({ bounty: data.data });
    } catch (err) {
        const error = err as AxiosError<SubscanError>;
        console.error('Subscan API error:', error.response?.data || error.message);
        res
            .status(error.response?.status || 500)
            .json({ error: error.response?.data?.message || error.message });
    }
} 