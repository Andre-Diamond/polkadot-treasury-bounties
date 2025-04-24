// src/lib/polkadot.ts
import { ApiPromise, WsProvider } from '@polkadot/api';
import '@polkadot/api-derive';

let api: ApiPromise | null = null;

export async function getPolkadotApi(): Promise<ApiPromise> {
    if (!api) {
        const provider = new WsProvider('wss://rpc.polkadot.io');
        api = await ApiPromise.create({ provider });
        await api.isReady;
    }
    return api;
}
