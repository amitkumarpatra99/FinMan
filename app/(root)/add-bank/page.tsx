'use client';

import HeaderBox from '@/components/HeaderBox';
import { useBank } from '@/context/BankContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const AddBank = () => {
    const router = useRouter();
    const { addBank } = useBank();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        balance: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newBank: Account = {
            id: `acc_${Date.now()}`,
            availableBalance: parseFloat(formData.balance),
            currentBalance: parseFloat(formData.balance),
            officialName: formData.bankName,
            mask: formData.accountNumber.slice(-4),
            institutionId: `ins_${Date.now()}`,
            name: formData.bankName,
            type: 'depository',
            subtype: 'checking',
            appwriteItemId: `app_${Date.now()}`,
            sharableId: `share_${Date.now()}`,
        };

        // Simulate API delay
        setTimeout(() => {
            addBank(newBank);
            toast.success('Bank added successfully!');
            setIsLoading(false);
            router.push('/');
        }, 1000);
    };

    return (
        <section className="flex">
            <div className="my-banks">
                <HeaderBox
                    title="Add Bank Account"
                    subtext="Link a new bank account to manage your funds."
                />

                <div className="space-y-4 pt-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white max-w-3xl">
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

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Account Number (Last 4 digits)</label>
                            <input
                                type="text"
                                className="input-class p-2 rounded-lg border border-gray-300"
                                placeholder="e.g. 1234"
                                maxLength={4}
                                pattern="\d{4}"
                                title="Please enter exactly 4 digits"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Initial Balance</label>
                            <input
                                type="number"
                                className="input-class p-2 rounded-lg border border-gray-300"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                required
                            />
                        </div>

                        <div className="payment-transfer_btn-box">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="payment-transfer_btn rounded-lg py-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Adding Bank...' : 'Add Bank'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddBank;
