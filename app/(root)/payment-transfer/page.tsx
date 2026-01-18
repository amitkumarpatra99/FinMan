"use client"
import React, { useState } from 'react'
import HeaderBox from '@/components/HeaderBox'
import { useBank } from '@/context/BankContext';

const PaymentTransfer = () => {
    const { accounts } = useBank();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        sourceAccount: '',
        targetAccount: '',
        amount: '',
        note: ''
    });

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert(`Transfer of ₹${formData.amount} to ${formData.targetAccount} successful!`);
            setFormData({ sourceAccount: '', targetAccount: '', amount: '', note: '' });
        }, 1000);
    }

    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Payment Transfer"
                subtext="Please provide any specific details or notes related to the payment transfer"
            />

            <section className="size-full pt-5">
                <form onSubmit={handleTransfer} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white max-w-3xl">
                    <h3 className="text-lg font-semibold text-gray-900">Transfer Details</h3>
                    <p className="text-gray-600">Enter transfer details below.</p>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Source Account</label>
                        <select
                            className="input-class p-2 rounded-lg border border-gray-300"
                            value={formData.sourceAccount}
                            onChange={(e) => setFormData({ ...formData, sourceAccount: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Bank Account</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.mask}) - ₹{acc.currentBalance}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Transfer To (Email or Account #)</label>
                        <input
                            type="text"
                            className="input-class p-2"
                            placeholder="e.g. friend@example.com"
                            value={formData.targetAccount}
                            onChange={(e) => setFormData({ ...formData, targetAccount: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            className="input-class p-2"
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Transfer Note (Optional)</label>
                        <textarea
                            className="input-class p-2"
                            placeholder="e.g. Dinner split"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    <div className="payment-transfer_btn-box">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="payment-transfer_btn rounded-lg py-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Transfer Funds'}
                        </button>
                    </div>
                </form>
            </section>
        </section>
    )
}

export default PaymentTransfer
