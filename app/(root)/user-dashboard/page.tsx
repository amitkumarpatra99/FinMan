'use client';

import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import { useBank } from '@/context/BankContext';
import { useRouter } from 'next/navigation';

const UserDashboard = () => {
    const { accounts, user } = useBank();
    const router = useRouter();

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="User Dashboard"
                        user={user?.firstName || 'Guest'}
                        subtext="Manage your profile and account settings."
                    />
                </header>

                <div className="space-y-6">
                    {/* User Details Card */}
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                            <button
                                onClick={() => router.push('/edit-profile')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <span>Edit Profile</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-500">Email Address</p>
                                <p className="text-base font-semibold text-gray-900">{user?.email}</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-base font-semibold text-gray-900">Not provided</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                <p className="text-base font-semibold text-gray-900">{user?.dateOfBirth || 'N/A'}</p>
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {user?.address1} {user?.city && `, ${user.city}`} {user?.state && `, ${user.state}`} {user?.postalCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500">Total Banks</p>
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a4.5 4.5 0 0 0-4.5 4.5v0A4.5 4.5 0 0 0 9.5 14H12" /><path d="M14.5 14H12" /></svg>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{accounts?.length || 0}</p>
                        </div>

                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500">Member Since</p>
                                <div className="p-2 bg-green-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">2024</p>
                        </div>
                    </div>
                </div>
            </div>

            <RightSidebar
                user={user}
                banks={accounts}
            />
        </section>
    );
};

export default UserDashboard;
