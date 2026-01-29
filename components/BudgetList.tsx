import React from 'react'
import BudgetCard from './BudgetCard'
import { budgets } from '@/constants'

const BudgetList = () => {
    return (
        <section className="flex w-full flex-col gap-6">
            <div className="flex flex-wrap gap-6">
                {budgets.map((budget) => (
                    <div key={budget.id} className="w-full md:w-[48%] xl:w-[32%]">
                        <BudgetCard
                            name={budget.name}
                            amount={budget.amount}
                            spent={budget.spent}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BudgetList
