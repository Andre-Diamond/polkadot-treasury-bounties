import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import type { Bounty, SubscanBountyResponse } from '../../types/bounty';
import { formatTokenAmount } from '../../lib/format';
import { networks } from '../../config/networks';

const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY!;

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
        const { proposal_id, network = 'polkadot' } = req.body;

        if (!proposal_id) {
            return res.status(400).json({ error: 'proposal_id is required' });
        }

        const { data } = await axios.post<SubscanBountyResponse>(
            `${networks[network as 'polkadot' | 'kusama'].subscanApiUrl}/scan/bounties/proposal`,
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

        // Format the token amount for the bounty
        if (data.data) {
            data.data.value = formatTokenAmount(data.data.value, network as 'polkadot' | 'kusama');
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