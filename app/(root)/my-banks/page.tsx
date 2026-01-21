'use client';

import HeaderBox from '@/components/HeaderBox'
import BankCard from '@/components/BankCard'
import React from 'react'
import Link from 'next/link';
import { useBank } from '@/context/BankContext';
import { toast } from 'sonner';

const MyBanks = () => {
    const { accounts, deleteBank, user: loggedIn } = useBank();

    return (
        <section className='flex'>
            <div className='my-banks'>
                <HeaderBox
                    title="My Bank Accounts"
                    subtext="Effortlessly manage your banking activities."
                />

                <div className="space-y-4">
                    <h2 className="header-2">
                        Your Cards
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {accounts && accounts.map((a: Account) => (
                            <div key={a.id} className="relative group">
                                <BankCard
                                    account={a}
                                    userName={loggedIn?.firstName}
                                />
                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/edit-bank?id=${a.id}`}
                                        className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                                        title="Edit Bank"
                                    >
                                        ✎
                                    </Link>
                                    <button
                                        onClick={() => {
                                            deleteBank(a.id);
                                            toast.success('Bank deleted successfully');
                                        }}
                                        className="bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                                        title="Delete Bank"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBanks


