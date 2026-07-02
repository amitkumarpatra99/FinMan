'use client';

import Image from 'next/image'
import React from 'react'
import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
    const router = useRouter();

    const handleLogOut = async () => {
        const loggedOut = await logoutAccount();

        if (loggedOut) {
            toast.success('Logged out successfully');
            router.push('/sign-in');
        } else {
            toast.error('Failed to log out');
        }
    }

    return (
        <footer className="footer">
            <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                <p className="text-xl font-bold text-gray-700">
                    {user.firstName ? user.firstName[0] : 'U'}
                </p>
            </div>

            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                <h1 className="text-14 truncate text-gray-700 font-semibold">
                    {user.firstName}
                </h1>
                <p className="text-14 truncate font-normal text-gray-600">
                    {user.email}
                </p>
            </div>

            <div className="footer_image" onClick={handleLogOut} style={{ cursor: 'pointer' }} title="Logout">
                <Image src="/icons/logout.svg" fill alt="logout" />
            </div>
        </footer>
    )
}

export default Footer
