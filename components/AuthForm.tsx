"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { INDIAN_STATES } from "@/constants";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address1: "",
            city: "",
            state: "",
            postalCode: "",
            dateOfBirth: "",
            ssn: "",
        },
    });

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage(""); // Reset error

        try {
            // Sign up with Appwrite & create plaid token

            if (type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }

                const newUser = await signUp(userData);

                if (newUser) {
                    setSuccess(true);
                    setTimeout(() => {
                        router.push('/sign-in'); // Re-redirect to login page as requested
                    }, 3000);
                }

                // setUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                })

                if (response) {
                    router.push('/')
                } else {
                    setErrorMessage("Invalid email or password. Please try again.");
                }
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className="cursor-pointer flex items-center gap-1">
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="FinMan logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                        FinMan
                    </h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user
                            ? "Link Account"
                            : type === "sign-in"
                                ? "Sign In"
                                : "Sign Up"}
                        <p className="text-16 font-normal text-gray-600">
                            {user
                                ? "Link your account to get started"
                                : "Please enter your details"}
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    {/* PlaidLink */}
                </div>
            ) : (
                <>
                    {success && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
                            <div className="flex flex-col items-center gap-6 p-10 bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                                {/* Success Icon SVG */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="128"
                                    height="128"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-green-500 animate-bounce"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <path d="m9 11 3 3L22 4" />
                                </svg>
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold text-gray-900">Success!</h2>
                                    <p className="text-lg text-gray-600">Account created successfully.</p>
                                    <p className="text-sm text-gray-500">Redirecting to login...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
                                        <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your last name' />
                                    </div>
                                    <CustomInput control={form.control} name='address1' label="Address" placeholder='Enter your specific address' />
                                    <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city' />
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='state' label="State" placeholder='Select your state' options={INDIAN_STATES} />
                                        <CustomInput control={form.control} name='postalCode' label="Postal Code" placeholder='Example: 11101' />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' />
                                        <CustomInput control={form.control} name='ssn' label="SSN" placeholder='Example: 1234' />
                                    </div>
                                </>
                            )}

                            <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />
                            <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' />

                            {errorMessage && (
                                <div className="text-red-500 text-sm font-medium">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <Button type="submit" disabled={isLoading} className="form-btn">
                                    {isLoading ? (
                                        <>
                                            Loading...
                                        </>
                                    ) : type === "sign-in"
                                        ? "Sign In"
                                        : "Sign Up"}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal text-gray-600">
                            {type === "sign-in"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </p>
                        <Link
                            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                            className="form-link"
                        >
                            {type === "sign-in" ? "Sign up" : "Sign in"}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    );
};

export default AuthForm;
