import HeaderBox from '@/components/HeaderBox'
import BarChart from '@/components/BarChart'
import DoughnutChart from '@/components/DoughnutChart'
import { accounts } from '@/constants'
import React from 'react'

const Analytics = () => {
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
                        <BarChart />
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
                            {/* Reusing DoughnutChart for simplicity, ideally pass different data */}
                            <DoughnutChart accounts={accounts} />
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Analytics
