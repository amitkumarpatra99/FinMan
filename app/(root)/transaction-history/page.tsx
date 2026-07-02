'use client';

import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions'
import { useBank } from '@/context/BankContext';
import { formatAmount } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

const TransactionHistoryContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const page = searchParams.get('page');
    const currentPage = Number(page) || 1;

    const { accounts, transactions } = useBank();

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
                {accounts.length === 0 ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                        <p className="text-sm text-gray-600">No bank accounts linked yet.</p>
                    </div>
                ) : (
                    <>
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
                                    {formatAmount(account?.currentBalance || 0)}
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
                    </>
                )}
            </div>
        </section>
    );
};

const TransactionHistory = () => {
    return (
        <Suspense fallback={
            <section className="transactions">
                <div className="transactions-header">
                    <HeaderBox
                        title="Transaction History"
                        subtext="Loading your transactions..."
                    />
                </div>
            </section>
        }>
            <TransactionHistoryContent />
        </Suspense>
    );
};

export default TransactionHistory;

