interface   Transfer {
    description: string;
    type: string;
    source: string;
    fee: number;
    feePayer: string;
    signature: string;
    slot: number;
    timestamp: number;
    tokenTransfers: any[];
    nativeTransfers: NativeTransfer[];
    accountData: AccountData[];
    transactionError: any;
    instructions: Instruction[];
    events: any;
}

interface NativeTransfer {
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
}

interface AccountData {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: any[];
}

interface Instruction {
    accounts: string[];
    data: string;
    programId: string;
    innerInstructions: any[];
}

export type { Transfer, NativeTransfer, AccountData, Instruction };