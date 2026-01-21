'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { accounts as initialAccounts, user as initialUser } from '@/constants';

interface BankContextType {
    accounts: Account[];
    user: User;
    addBank: (bank: Account) => void;
    deleteBank: (id: string) => void;
    updateBank: (bank: Account) => void;
    updateUser: (user: User) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: React.ReactNode }) {
    // Initialize state properly to handle hydration
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [user, setUser] = useState(initialUser);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const storedAccounts = localStorage.getItem('finman_accounts');
        const storedUser = localStorage.getItem('finman_user');

        if (storedAccounts) {
            setAccounts(JSON.parse(storedAccounts));
        }
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsInitialized(true);
    }, []);

    // Persist accounts whenever they change (after initialization)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('finman_accounts', JSON.stringify(accounts));
        }
    }, [accounts, isInitialized]);

    // Persist user whenever it changes (after initialization)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('finman_user', JSON.stringify(user));
        }
    }, [user, isInitialized]);

    const addBank = (bank: Account) => {
        setAccounts((prev) => [...prev, bank]);
    };

    const deleteBank = (id: string) => {
        setAccounts((prev) => prev.filter((account) => account.id !== id));
    };

    const updateBank = (updatedBank: Account) => {
        setAccounts((prev) => prev.map((acc) => (acc.id === updatedBank.id ? updatedBank : acc)));
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    // Prevent hydration mismatch by rendering children only after mount (optional but safer)
    // For now we just return the provider, but with initial state matching server if empty
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
