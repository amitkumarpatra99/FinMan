'use client';

import HeaderBox from '@/components/HeaderBox';
import { useBank } from '@/context/BankContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const EditProfile = () => {
    const router = useRouter();
    const { user, updateUser } = useBank();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(prev => {
                if (prev.firstName === user.firstName && prev.lastName === user.lastName && prev.email === user.email) {
                    return prev;
                }
                return {
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                };
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Update User
        updateUser({
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
        });

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Profile updated successfully!');
            router.back();
        }, 1000);
    };

    return (
        <section className="flex">
            <div className="my-banks">
                <HeaderBox
                    title="Edit Profile"
                    subtext="Update your personal details."
                />

                <div className="space-y-4 pt-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white max-w-3xl">
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

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="input-class p-2 rounded-lg border border-gray-300"
                                placeholder="e.g. amit@jsm.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
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

export default EditProfile;
