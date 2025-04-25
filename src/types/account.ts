export interface AccountResponse {
    account: AccountInfo;
}

export interface PeopleData {
    display?: string;
    identity?: boolean;
    judgements?: RegistrationJudgementJson[];
    parent?: AccountParentJson;
}

export interface ExtraData {
    amount?: string;
    conviction?: string;
    origins?: number;
    proxy_type?: string;
    [key: string]: unknown;
}

export interface ProxyData {
    proxy_type: string;
    delay: number;
    [key: string]: unknown;
}

export interface RegistrarInfo {
    registrar_fee: string;
    registrar_index: number;
}

export interface StakingInfo {
    controller: string;
    controller_display: AccountDisplay;
    reward_account: string;
    reward_display: AccountDisplay;
}

export interface VestingInfo {
    linear_schedules: LinearVestingSchedule[];
    orml_schedules: OrmlVestingSchedule[];
    pallet_schedules: PalletVestingSchedule[];
    total_locked: string;
    type: string;
}

export interface AccountInfo {
    address: string;
    display: string;
    account_display: {
        address: string;
        people: Record<string, PeopleData>;
        identity: boolean;
    };
    balance: string;
    reserved: string;
    bonded: string;
    unbonding: string;
    nonce: number;
    count_extrinsic: number;
    is_council_member: boolean;
    is_techcomm_member: boolean;
    is_fellowship_member: boolean;
    is_registrar: boolean;
    is_module_account: boolean;
    is_evm_contract: boolean;
    is_erc20: boolean;
    is_erc721: boolean;
    judgements: Array<{
        index: number;
        judgement: string;
    }>;
    multisig?: {
        multi_account: Array<{
            address: string;
            people: Record<string, PeopleData>;
        }>;
    };
    // Social fields
    twitter: string;
    matrix: string;
    email: string;
    web: string;
    discord: string;
    github: string;
    riot: string;
    legal: string;
    role: string;
    // Additional fields
    assets_tag: string | null;
    balance_lock: string;
    conviction_lock: string;
    democracy_lock: string;
    election_lock: string;
    evm_account: string;
    extra: ExtraData;
    lock: string;
    nft_amount: string;
    proxy: Record<string, ProxyData>;
    registrar_info: RegistrarInfo;
    staking_info: StakingInfo;
    stash: string;
    substrate_account: string | null;
    vesting: VestingInfo;
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