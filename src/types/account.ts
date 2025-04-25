export interface AccountResponse {
    account: AccountInfo;
}

export interface AccountInfo {
    address: string;
    display: string;
    balance: string;
    reserved: string;
    bonded: string;
    unbonding: string;
    nonce: number;
    count_extrinsic: number;
    is_council_member: boolean;
    is_techcomm_member: boolean;
    twitter: string;
    matrix: string;
    email: string;
    web: string;
    account_display: {
        address: string;
        identity: boolean;
        people: {
            display: string;
        };
        judgements: Array<{
            index: number;
            judgement: string;
        }>;
    };
    judgements: Array<{
        index: number;
        judgement: string;
    }>;
    multisig: {
        multi_account: Array<{
            address: string;
            people: Record<string, never>;
        }>;
    };
    balance_lock: string;
    conviction_lock: string;
    democracy_lock: string;
    election_lock: string;
    lock: string;
    nft_amount: string;
    proxy: Record<string, never>;
    registrar_info: null;
    staking_info: null;
    vesting: null;
}

export interface AccountDisplay {
    account_index: string;
    address: string;
    display: string;
    evm_address: string;
    evm_contract: EvmAccountDisplay;
    identity: boolean;
    judgements: RegistrationJudgementJson[];
    merkle: MerkleTag;
    parent: AccountParentJson;
    people: SampleIdentity;
}

export interface EvmAccountDisplay {
    contract_name: string;
    verify_source: string;
}

export interface MerkleTag {
    address_type: string;
    tag_name: string;
    tag_subtype: string;
    tag_type: string;
}

export interface AccountParentJson {
    address: string;
    display: string;
    identity: boolean;
    sub_symbol: string;
}

export interface SampleIdentity {
    display: string;
    identity: boolean;
    judgements: RegistrationJudgementJson[];
    parent: AccountParentJson;
}

export interface RegistrationJudgementJson {
    index: number;
    judgement: string;
}

export interface DelegateAccountJson {
    conviction_delegate: DelegateJson[];
    conviction_delegated: DelegateJson[];
    democracy_delegate: DelegateJson[];
    democracy_delegated: DelegateJson[];
}

export interface DelegateJson {
    account: AccountDisplay;
    amount: string;
    conviction: string;
    delegate_account: AccountDisplay;
    origins: number;
}

export interface MultiAccountJson {
    multi_account: AccountDisplay[];
    multi_account_member: AccountDisplay[];
    threshold: number;
}

export interface ProxyAccountJson {
    proxy_account: ProxyAccountInfoJson[];
    real_account: ProxyAccountInfoJson[];
}

export interface ProxyAccountInfoJson {
    account_display: AccountDisplay;
    proxy_type: string;
}

export interface RoleRegistrarJson {
    registrar_fee: string;
    registrar_index: number;
}

export interface StakingAccount {
    controller: string;
    controller_display: AccountDisplay;
    reward_account: string;
    reward_display: AccountDisplay;
}

export interface VestingJson {
    linear_schedules: LinearVestingSchedule[];
    orml_schedules: OrmlVestingSchedule[];
    pallet_schedules: PalletVestingSchedule[];
    total_locked: string;
    type: string;
}

export interface LinearVestingSchedule {
    balance: string;
    cliff: number;
    vesting: number;
}

export interface OrmlVestingSchedule {
    per_period: string;
    period: number;
    period_count: number;
    start: number;
}

export interface PalletVestingSchedule {
    locked: string;
    per_block: string;
    starting_block: number;
}

export interface AccountJsonExtra {
    amount: string;
    conviction: string;
    origins: number;
    proxy_type: string;
}

export interface AccountDerive {
    balance: string;
    bonded: string;
    id: number;
    locked: string;
    reserved: string;
    token: string;
    unbonding: string;
    unique_id: string;
} 