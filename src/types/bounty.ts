// src/types/bounty.ts

export interface Account {
    account_index: string;
    address: string;
    display: string;
    evm_address: string;
    evm_contract: {
        contract_name: string;
        verify_source: string;
    };
    identity: boolean;
    judgements: Array<{
        index: number;
        judgement: string;
    }>;
    merkle: {
        address_type: string;
        tag_name: string;
        tag_subtype: string;
        tag_type: string;
    };
    parent: {
        address: string;
        display: string;
        identity: boolean;
        sub_symbol: string;
    };
    people: {
        display: string;
        identity: boolean;
        judgements: Array<{
            index: number;
            judgement: string;
        }>;
        parent: {
            address: string;
            display: string;
            identity: boolean;
            sub_symbol: string;
        };
    };
}

export interface TimelineItem {
    block: number;
    extrinsic_index: string;
    index: number;
    params: unknown;
    prophecy: boolean;
    status: string;
    time: number;
}

export interface Bounty {
    beneficiary?: Account;
    bond?: string;
    created_block?: number;
    curator?: Account;
    curator_deposit?: string;
    curator_fee?: string;
    description: string;
    expire_block?: number;
    proposal_id: number;
    proposer: Account;
    status: string;
    timeline?: TimelineItem[];
    title: string;
    value: string;
    block_timestamp?: number; // Keeping for backward compatibility
}

export interface SubscanBountyResponse {
    code: number;
    data: Bounty;
    generated_at: number;
    message: string;
}

