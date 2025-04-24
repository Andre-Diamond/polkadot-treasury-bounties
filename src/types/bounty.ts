// src/types/bounty.ts

export interface Bounty {
    block_timestamp: number;
    description: string;
    proposal_id: number;
    proposer: {
        address: string;
        account_index: string;
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
    };
    status: string;
    title: string;
    value: string;
}

 