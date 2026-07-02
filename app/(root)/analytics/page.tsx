'use client';

import HeaderBox from '@/components/HeaderBox'
import BarChart from '@/components/BarChart'
import DoughnutChart from '@/components/DoughnutChart'
import { useBank } from '@/context/BankContext'
import React from 'react'

const Analytics = () => {
    const { accounts, transactions } = useBank();

    // 1. Group Spending by Category (debit only)
    const spendingByCategory: Record<string, number> = {};
    transactions.forEach(t => {
        if (t.type === 'debit') {
            const category = t.category || 'Other';
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            spendingByCategory[formattedCategory] = (spendingByCategory[formattedCategory] || 0) + Math.abs(t.amount);
        }
    });
    const categoryLabels = Object.keys(spendingByCategory);
    const categoryData = Object.values(spendingByCategory);

    // 2. Calculate Monthly Spending vs Income
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySpending = Array(12).fill(0);
    const monthlyIncome = Array(12).fill(0);

    transactions.forEach(t => {
        const date = new Date(t.date);
        if (!isNaN(date.getTime())) {
            const monthIndex = date.getMonth(); // 0-11
            if (t.type === 'debit') {
                monthlySpending[monthIndex] += Math.abs(t.amount);
            } else if (t.type === 'credit') {
                monthlyIncome[monthIndex] += Math.abs(t.amount);
            }
        }
    });

    // To make the chart look nice and clean, let's only display months that have activity
    const activeMonthsIndices: number[] = [];
    for (let i = 0; i < 12; i++) {
        if (monthlySpending[i] > 0 || monthlyIncome[i] > 0) {
            activeMonthsIndices.push(i);
        }
    }

    // Default to last 6 months if no activity
    let finalLabels = monthNames.slice(0, 6);
    let finalSpending = monthlySpending.slice(0, 6);
    let finalIncome = monthlyIncome.slice(0, 6);

    if (activeMonthsIndices.length > 0) {
        // Find range from first active month to last active month
        const first = Math.min(...activeMonthsIndices);
        const last = Math.max(...activeMonthsIndices);
        // Ensure at least a range of 3 months is shown for visual aesthetics
        const start = Math.max(0, first);
        const end = Math.min(11, Math.max(last, start + 2));
        
        finalLabels = monthNames.slice(start, end + 1);
        finalSpending = monthlySpending.slice(start, end + 1);
        finalIncome = monthlyIncome.slice(start, end + 1);
    }

    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Analytics"
                subtext="Visualize your financial data and spending habits."
            />

            <section className="size-full pt-5 flex flex-col gap-8">
                <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 border-none shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Overview</h3>
                    <div className="h-[400px] w-full flex items-center justify-center">
                        <BarChart 
                            spendingData={finalSpending}
                            incomeData={finalIncome}
                            labels={finalLabels}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 border-none shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset Distribution</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <DoughnutChart accounts={accounts} />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 border-none shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Spending by Category</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {categoryLabels.length === 0 ? (
                                <p className="text-sm text-gray-500">No debit transactions yet to show distribution.</p>
                            ) : (
                                <DoughnutChart labels={categoryLabels} data={categoryData} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Analytics

