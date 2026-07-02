'use client';

import React from 'react'
import BudgetCard from './BudgetCard'
import { useBank } from '@/context/BankContext'
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const BudgetList = () => {
    const { budgets, transactions, deleteBudget } = useBank();

    return (
        <section className="flex w-full flex-col gap-6">
            {budgets.length === 0 ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-600">No budgets created yet. Use the form below to add one!</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {budgets.map((budget) => {
                        // Calculate spent dynamically based on transactions in context
                        const dynamicSpent = transactions
                            .filter(t => t.type === 'debit' && t.category.toLowerCase() === budget.name.toLowerCase())
                            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                        return (
                            <div key={budget.id} className="w-full md:w-[48%] xl:w-[32%] relative group">
                                <BudgetCard
                                    name={budget.name}
                                    amount={budget.amount}
                                    spent={Number(dynamicSpent.toFixed(2))}
                                />
                                <button
                                    onClick={() => {
                                        deleteBudget(budget.id);
                                        toast.success('Budget deleted successfully');
                                    }}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow cursor-pointer"
                                    title="Delete Budget"
                                >
                                    <Trash size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    )
}

export default BudgetList

