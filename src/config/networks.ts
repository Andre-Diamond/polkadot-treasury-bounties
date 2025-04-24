export type Network = 'polkadot' | 'kusama';

export interface NetworkConfig {
    name: string;
    subscanApiUrl: string;
    rpcUrl: string;
    symbol: string;
    decimals: number;
}

export const networks: Record<Network, NetworkConfig> = {
    polkadot: {
        name: 'Polkadot',
        subscanApiUrl: 'https://polkadot.api.subscan.io/api',
        rpcUrl: 'wss://rpc.polkadot.io',
        symbol: 'DOT',
        decimals: 10
    },
    kusama: {
        name: 'Kusama',
        subscanApiUrl: 'https://kusama.api.subscan.io/api',
        rpcUrl: 'wss://kusama-rpc.polkadot.io',
        symbol: 'KSM',
        decimals: 12
    }
}; 