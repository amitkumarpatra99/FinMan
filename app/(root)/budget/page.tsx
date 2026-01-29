import HeaderBox from '@/components/HeaderBox'
import BudgetList from '@/components/BudgetList'
import React from 'react'

const Budget = () => {
    return (
        <section className="flex">
            <div className="flex w-full flex-col gap-8 bg-gray-25 p-8 md:p-12">
                <HeaderBox
                    title="My Budgets"
                    subtext="Manage your saving limits and track your expenses."
                />

                <BudgetList />
            </div>
        </section>
    )
}

export default Budget
