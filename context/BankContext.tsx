'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { accounts as initialAccounts } from '@/constants';

interface BankContextType {
    accounts: Account[];
    addBank: (bank: Account) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: React.ReactNode }) {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

    const addBank = (bank: Account) => {
        setAccounts((prev) => [...prev, bank]);
    };

    return (
        <BankContext.Provider value={{ accounts, addBank }}>
            {children}
        </BankContext.Provider>
    );
}

export function useBank() {
    const context = useContext(BankContext);
    if (context === undefined) {
        throw new Error('useBank must be used within a BankProvider');
    }
    return context;
}
