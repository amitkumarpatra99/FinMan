'use client';

import HeaderBox from '@/components/HeaderBox'
import BankCard from '@/components/BankCard'
import React from 'react'
import Link from 'next/link';
import { useBank } from '@/context/BankContext';
import { user } from '@/constants';

const MyBanks = () => {
    const loggedIn = user;
    const { accounts } = useBank();

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
                            <BankCard
                                key={a.id}
                                account={a}
                                userName={loggedIn?.firstName}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBanks


