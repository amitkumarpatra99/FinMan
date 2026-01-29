import React from 'react'
import { cn } from "@/lib/utils"

interface BudgetCardProps {
    name: string;
    amount: number;
    spent: number;
}

const BudgetCard = ({ name, amount, spent }: BudgetCardProps) => {
    const percentage = Math.min((spent / amount) * 100, 100);

    return (
        <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
                <h2 className="text-16 font-semibold text-gray-900">{name}</h2>
                <p className="text-12 font-medium text-gray-600">
                    ${spent} / ${amount}
                </p>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-500", percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500')}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="text-12 text-gray-500">{percentage.toFixed(0)}% used</p>
        </div>
    )
}

export default BudgetCard
