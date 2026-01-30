'use client';

import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { useBank } from '@/context/BankContext';
import { transactions } from '@/constants';

import BankCard from '@/components/BankCard'; // Added import

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

                {/* Mobile Banks Section */}
                <section className="flex w-full flex-col gap-6 xl:hidden">
                    <div className="flex w-full justify-between">
                        <h2 className="header-2">My Banks</h2>
                    </div>
                    {accounts?.length > 0 && (
                        <div className="flex w-full flex-nowrap gap-4 overflow-x-auto no-scrollbar pb-4">
                            {accounts.map((account: Account) => (
                                <div key={account.id} className="min-w-[300px]">
                                    <BankCard
                                        account={account}
                                        userName={`${loggedIn?.firstName} ${loggedIn?.lastName}`}
                                        showBalance={false}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <RecentTransactions
                    accounts={accounts}
                    transactions={transactions}
                    appwriteItemId={accounts[0]?.appwriteItemId}
                    page={1}
                    rowsPerPage={5}
                    enableSearch
                    enablePagination
                />
            </div>

            <RightSidebar
                user={loggedIn}
                banks={accounts}
            />
        </section>
    )
}

export default Home
