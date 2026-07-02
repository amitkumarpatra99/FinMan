'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { accounts as initialAccounts, user as initialUser, transactions as initialTransactions, budgets as initialBudgets } from '@/constants';

interface BankContextType {
    accounts: Account[];
    transactions: Transaction[];
    budgets: Budget[];
    user: User;
    addBank: (bank: Account) => void;
    deleteBank: (id: string) => void;
    updateBank: (bank: Account) => void;
    updateUser: (user: User) => void;
    addTransaction: (transaction: Transaction) => void;
    addBudget: (budget: Budget) => void;
    deleteBudget: (id: number) => void;
    updateAccountBalance: (accountId: string, amount: number, type: 'credit' | 'debit') => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children, user }: { children: React.ReactNode, user?: User }) {
    // Initialize state properly to handle hydration
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
    const [currentUser, setCurrentUser] = useState(user || initialUser);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const storedAccounts = localStorage.getItem('finman_accounts');
        if (storedAccounts) {
            setAccounts(JSON.parse(storedAccounts));
        }

        const storedTransactions = localStorage.getItem('finman_transactions');
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }

        const storedBudgets = localStorage.getItem('finman_budgets');
        if (storedBudgets) {
            setBudgets(JSON.parse(storedBudgets));
        }

        setIsInitialized(true);
    }, []);

    // Sync user from prop if changed/available
    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    // Persist states whenever they change (after initialization)
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('finman_accounts', JSON.stringify(accounts));
        }
    }, [accounts, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('finman_transactions', JSON.stringify(transactions));
        }
    }, [transactions, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('finman_budgets', JSON.stringify(budgets));
        }
    }, [budgets, isInitialized]);

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

    const addTransaction = (transaction: Transaction) => {
        setTransactions((prev) => [transaction, ...prev]);
    };

    const addBudget = (budget: Budget) => {
        setBudgets((prev) => [...prev, budget]);
    };

    const deleteBudget = (id: number) => {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
    };

    const updateAccountBalance = (accountId: string, amount: number, type: 'credit' | 'debit') => {
        setAccounts((prev) =>
            prev.map((acc) => {
                if (acc.id === accountId || acc.appwriteItemId === accountId) {
                    const newBalance =
                        type === 'credit'
                            ? acc.currentBalance + amount
                            : acc.currentBalance - amount;
                    return {
                        ...acc,
                        currentBalance: Number(newBalance.toFixed(2)),
                        availableBalance: Number(newBalance.toFixed(2)),
                    };
                }
                return acc;
            })
        );
    };

    return (
        <BankContext.Provider value={{ 
            accounts, 
            transactions, 
            budgets, 
            user: currentUser, 
            addBank, 
            deleteBank, 
            updateBank, 
            updateUser,
            addTransaction,
            addBudget,
            deleteBudget,
            updateAccountBalance
        }}>
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
