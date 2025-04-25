import { NextApiRequest, NextApiResponse } from 'next';
import { networks } from '../../../config/networks';

const SUBSCAN_API_KEY = '4d0c8ba32dde4a06bda83d52af49120f';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.query;
    const { network } = req.query;

    if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Address is required' });
    }

    if (!network || typeof network !== 'string' || !['polkadot', 'kusama'].includes(network)) {
        return res.status(400).json({ error: 'Valid network is required' });
    }

    try {
        const response = await fetch(networks[network as 'polkadot' | 'kusama'].subscanAccountApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': SUBSCAN_API_KEY
            },
            body: JSON.stringify({
                key: address
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch account info');
        }

        const data = await response.json();
        res.status(200).json(data.data);
    } catch (error) {
        console.error('Error fetching account info:', error);
        res.status(500).json({ error: 'Failed to fetch account info' });
    }
} 