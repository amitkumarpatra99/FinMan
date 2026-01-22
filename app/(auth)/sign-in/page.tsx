import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignIn = () => {
    return (
        <section className="flex-center size-full max-sm:px-6"> {/* flex-center handles alignment */}
            <AuthForm type="sign-in" />
        </section>
    )
}

export default SignIn
