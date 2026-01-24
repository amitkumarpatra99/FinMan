'use client';

import HeaderBox from '@/components/HeaderBox';
import { useBank } from '@/context/BankContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const EditBank = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bankId = searchParams.get('id');
    const { accounts, user, updateBank, updateUser } = useBank();

    const [isLoading, setIsLoading] = useState(false);

    // Initialize form data directly from context if available, or empty strings
    // This avoids the need for a useEffect to sync state, which causes the lint error
    const [formData, setFormData] = useState({
        bankName: '',
        firstName: '',
        lastName: '',
    });

    useEffect(() => {
        if (bankId && accounts.length > 0) {
            const bank = accounts.find((acc) => acc.id === bankId);
            if (bank) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setFormData(prev => {
                    if (prev.bankName === bank.name && prev.firstName === user.firstName && prev.lastName === user.lastName) {
                        return prev;
                    }
                    return {
                        ...prev,
                        bankName: bank.name,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    };
                });
            }
        }
    }, [bankId, accounts, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Update User
        updateUser({
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
        });

        // Update Bank
        if (bankId) {
            const bank = accounts.find((acc) => acc.id === bankId);
            if (bank) {
                updateBank({
                    ...bank,
                    name: formData.bankName,
                });
            }
        }

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            router.back();
        }, 1000);
    };

    if (!bankId) return <p>Invalid Bank ID</p>;

    return (
        <section className="flex">
            <div className="my-banks">
                <HeaderBox
                    title="Edit Details"
                    subtext="Update your bank and profile details."
                />

                <div className="space-y-4 pt-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white max-w-3xl">
                        <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                                type="text"
                                className="input-class p-2 rounded-lg border border-gray-300"
                                placeholder="e.g. HDFC Bank"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                required
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 pt-4">Profile Details (Displayed on Card)</h3>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="input-class p-2 rounded-lg border border-gray-300"
                                    placeholder="e.g. Amit"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="input-class p-2 rounded-lg border border-gray-300"
                                    placeholder="e.g. JSM"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="payment-transfer_btn-box mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="payment-transfer_btn rounded-lg py-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default EditBank;
