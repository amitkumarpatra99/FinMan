
import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions'
import { accounts, transactions } from '@/constants';
import { formatAmount } from '@/lib/utils';
import React from 'react'

const TransactionHistory = async ({ searchParams }: { searchParams: Promise<{ id?: string; page?: string }> }) => {
    const { id, page } = await searchParams;
    const currentPage = Number(page as string) || 1;

    const currentAccountId = id || accounts[0]?.appwriteItemId;
    const account = accounts.find((a) => a.appwriteItemId === currentAccountId) || accounts[0];

    return (
        <section className="transactions">
            <div className="transactions-header">
                <HeaderBox
                    title="Transaction History"
                    subtext="See your bank details and transactions."
                />
            </div>

            <div className="space-y-6">
                <div className="transactions-account">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-18 font-bold text-white">{account?.name}</h2>
                        <p className="text-14 text-blue-25">
                            {account?.officialName}
                        </p>
                        <p className="text-14 font-semibold tracking-[1.1px] text-white">
                            ●●●● ●●●● ●●●● {account?.mask}
                        </p>
                    </div>

                    <div className='transactions-account-balance'>
                        <p className="text-14">Current Balance</p>
                        <p className="text-24 text-center font-bold">
                            {formatAmount(account?.currentBalance)}
                        </p>
                    </div>
                </div>

                <section className="flex w-full flex-col gap-6">
                    <RecentTransactions
                        accounts={accounts}
                        transactions={transactions}
                        appwriteItemId={account?.appwriteItemId}
                        page={currentPage}
                        rowsPerPage={10}
                        enableSearch
                        enablePagination
                    />
                </section>
            </div>
        </section>
    )
}

export default TransactionHistory
