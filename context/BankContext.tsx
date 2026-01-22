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

export function BankProvider({ children, user }: { children: React.ReactNode, user?: User }) {
    // Initialize state properly to handle hydration
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [currentUser, setCurrentUser] = useState(user || initialUser);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const storedAccounts = localStorage.getItem('finman_accounts');
        // If we have a user from props, we might not want to overwrite with local storage immediately if props is fresher?
        // But for now let's keep logic similar but prefer prop if available initially.

        if (storedAccounts) {
            setAccounts(JSON.parse(storedAccounts));
        }
        // Sync user from prop if changed/available
        if (user) {
            setCurrentUser(user);
        }
        setIsInitialized(true);
    }, [user]);

    // Persist accounts whenever they change (after initialization)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('finman_accounts', JSON.stringify(accounts));
        }
    }, [accounts, isInitialized]);

    // Persist user whenever it changes (after initialization)
    // Avoid overwriting if we just loaded from prop?
    // Let's simplify: if user is logged in, we use that.

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
        setCurrentUser(updatedUser);
    };

    // Prevent hydration mismatch by rendering children only after mount (optional but safer)
    // For now we just return the provider, but with initial state matching server if empty
    return (
        <BankContext.Provider value={{ accounts, user: currentUser, addBank, deleteBank, updateBank, updateUser }}>
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
