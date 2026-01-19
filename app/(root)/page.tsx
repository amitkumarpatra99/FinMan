'use client';

import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import Link from 'next/link';
import { useBank } from '@/context/BankContext';
import { transactions } from '@/constants';

const Home = () => {
    const { accounts, user: loggedIn } = useBank();
    const totalCurrentBalance = accounts.reduce((acc, account) => acc + account.currentBalance, 0);

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.firstName || 'Guest'}
                        subtext="Access and manage your account and transactions efficiently."
                    />

                    <TotalBalanceBox
                        accounts={accounts}
                        totalBanks={accounts.length}
                        totalCurrentBalance={totalCurrentBalance}
                    />
                </header>

                <RecentTransactions
                    accounts={accounts}
                    transactions={transactions}
                    appwriteItemId={accounts[0]?.appwriteItemId}
                    page={1}
                    rowsPerPage={5}
                />
            </div>

            <RightSidebar
                user={loggedIn}
                transactions={transactions}
                banks={accounts}
            />
        </section>
    )
}

export default Home
