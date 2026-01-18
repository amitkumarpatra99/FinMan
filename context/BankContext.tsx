'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { accounts as initialAccounts, user as initialUser } from '@/constants';

interface BankContextType {
    accounts: Account[];
    user: any;
    addBank: (bank: Account) => void;
    deleteBank: (id: string) => void;
    updateBank: (bank: Account) => void;
    updateUser: (user: any) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: React.ReactNode }) {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [user, setUser] = useState(initialUser);

    const addBank = (bank: Account) => {
        setAccounts((prev) => [...prev, bank]);
    };

    const deleteBank = (id: string) => {
        setAccounts((prev) => prev.filter((account) => account.id !== id));
    };

    const updateBank = (updatedBank: Account) => {
        setAccounts((prev) => prev.map((acc) => (acc.id === updatedBank.id ? updatedBank : acc)));
    };

    const updateUser = (updatedUser: any) => {
        setUser(updatedUser);
    };

    return (
        <BankContext.Provider value={{ accounts, user, addBank, deleteBank, updateBank, updateUser }}>
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
