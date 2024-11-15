
export interface Wallet {
    id: number,
    name: string,
    type: string,
    balance: number,
    currency: string,
    provider?: string,
    userId?: string,
    creditLimit?: number
}

export interface Budget {
    id: number,
    name: string,
    userId?: string,
    totalAmount: number,
    period: string,
    startDate: string | null,
    lastMonthExpenses?: number,
    taxes: number,
    debt: number,
}

export interface Transaction {
    id: number,
    name: string,
    category?: string,
    date: string | null,
    description?: string,
    amount: number,
    currency?: string,
    userId?: string,
    walletId: number ,
    desc?: string,
    goalId?: number
}

export interface Goal {
    id: number,
    name: string,
    walletId:number,
    targetAmount: number,
    currentAmount: number,
    startDate: string | null,
    targetDate: string | null,
    status?: string,
}