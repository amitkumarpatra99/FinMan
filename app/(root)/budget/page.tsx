'use client';

import HeaderBox from '@/components/HeaderBox'
import BudgetList from '@/components/BudgetList'
import React, { useState } from 'react'
import { useBank } from '@/context/BankContext'
import { toast } from 'sonner'

const Budget = () => {
    const { addBudget, budgets } = useBank();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const handleCreateBudget = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !amount) {
            toast.error('Please enter valid budget details.');
            return;
        }

        const limit = Number(amount);
        if (limit <= 0) {
            toast.error('Limit must be greater than 0.');
            return;
        }

        const exists = budgets.some(b => b.name.toLowerCase() === name.trim().toLowerCase());
        if (exists) {
            toast.error('A budget for this category already exists.');
            return;
        }

        const newBudget: Budget = {
            id: Date.now(),
            name: name.trim().charAt(0).toUpperCase() + name.trim().slice(1),
            amount: limit,
            spent: 0
        };

        addBudget(newBudget);
        toast.success(`Budget for "${newBudget.name}" created!`);
        setName('');
        setAmount('');
    };

    return (
        <section className="flex">
            <div className="flex w-full flex-col gap-8 bg-gray-25 p-8 md:p-12">
                <HeaderBox
                    title="My Budgets"
                    subtext="Manage your saving limits and track your expenses."
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* List of Budgets */}
                    <div className="flex-1 flex flex-col gap-6">
                        <h3 className="text-lg font-semibold text-gray-900">Active Budgets</h3>
                        <BudgetList />
                    </div>

                    <div className="w-full lg:w-[320px] shrink-0">
                        <form onSubmit={handleCreateBudget} className="flex flex-col gap-4 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Budget</h3>
                            <p className="text-xs text-gray-600">Set limits for specific categories (e.g. Groceries, Entertainment, Shopping).</p>

                            <div className="flex flex-col gap-1.5 pt-2">
                                <label className="text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Groceries"
                                    className="input-class p-2 rounded-lg border border-gray-300 text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Monthly Limit (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    min="1"
                                    step="1"
                                    className="input-class p-2 rounded-lg border border-gray-300 text-sm"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow mt-2 cursor-pointer"
                            >
                                Create Budget
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Budget

