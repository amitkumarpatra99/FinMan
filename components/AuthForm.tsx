"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { INDIAN_STATES } from "@/constants";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";
import { Loader, Mail, Lock, User, MapPin, Building, Calendar, Hash, CheckCircle2 } from "lucide-react";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
    const router = useRouter();
    const [user] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const formSchema = authFormSchema(type);

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

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
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
                        router.push('/sign-in');
                    }, 3000);
                }
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
        <div className="flex min-h-screen w-full">
            {/* Left Side - Form */}
            <section className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-1/2 transition-all duration-300">
                <div className="mx-auto w-full max-w-[420px] lg:max-w-sm">
                    <div className="mb-8 lg:mb-12">
                        <Link href="/" className="flex items-center gap-3 mb-6 cursor-pointer group">
                            <div className="relative size-[40px]">
                                <Image
                                    src="/icons/logo.svg"
                                    fill
                                    alt="FinMan logo"
                                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-ibm-plex-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                FinMan
                            </h1>
                        </Link>

                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 mb-2 lg:mb-3">
                            {user
                                ? "Link Account"
                                : type === "sign-in"
                                    ? "Welcome back"
                                    : "Create an account"}
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600">
                            {user
                                ? "Link your account to get started"
                                : type === "sign-in"
                                    ? "Please enter your details to sign in."
                                    : "Enter your details below to create your account"}
                        </p>
                    </div>

                    {user ? (
                        <div className="flex flex-col gap-4">
                            {/* PlaidLink */}
                        </div>
                    ) : (
                        <>
                            {success && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                                    <div className="flex flex-col items-center gap-6 p-6 lg:p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 w-full max-w-sm">
                                        <div className="rounded-full bg-green-100 p-3">
                                            <CheckCircle2 className="h-10 w-10 lg:h-12 lg:w-12 text-green-600 animate-bounce" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Success!</h2>
                                            <p className="text-sm lg:text-base text-gray-600">Account created successfully.</p>
                                            <p className="text-sm text-blue-600 font-medium animate-pulse">Redirecting to login...</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 lg:space-y-6">
                                    {type === 'sign-up' && (
                                        <div className="space-y-3 lg:space-y-4 animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-backwards delay-100">
                                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                <CustomInput control={form.control} name='firstName' label="First Name" placeholder='John' icon={User} />
                                                <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Doe' icon={User} />
                                            </div>
                                            <CustomInput control={form.control} name='address1' label="Address" placeholder='123 Main St' icon={MapPin} />
                                            <CustomInput control={form.control} name='city' label="City" placeholder='New York' icon={Building} />
                                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                <CustomInput control={form.control} name='state' label="State" placeholder='Select State' options={INDIAN_STATES} />
                                                <CustomInput control={form.control} name='postalCode' label="Postal Code" placeholder='11101' icon={MapPin} />
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' icon={Calendar} />
                                                <CustomInput control={form.control} name='ssn' label="SSN" placeholder='1234' icon={Hash} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3 lg:space-y-4 animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-backwards delay-200">
                                        <CustomInput control={form.control} name='email' label="Email" placeholder='john.doe@example.com' icon={Mail} />
                                        <CustomInput control={form.control} name='password' label="Password" placeholder='••••••••' icon={Lock} />
                                    </div>

                                    {errorMessage && (
                                        <div className="rounded-md bg-red-50 p-3 lg:p-4 animate-in shake">
                                            <div className="flex">
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 lg:py-6 rounded-lg shadow-lg active:scale-[0.98] transition-all duration-200 text-base"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader size={20} className="animate-spin" />
                                                    Loading...
                                                </div>
                                            ) : type === "sign-in"
                                                ? "Sign In"
                                                : "Sign Up"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>

                            <footer className="flex justify-center gap-1 pt-6 text-sm text-center text-gray-600">
                                <p>
                                    {type === "sign-in"
                                        ? "Don't have an account?"
                                        : "Already have an account?"}
                                </p>
                                <Link
                                    href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                                >
                                    {type === "sign-in" ? "Sign up" : "Sign in"}
                                </Link>
                            </footer>
                        </>
                    )}
                </div>
            </section>

            {/* Right Side - Image/Branding */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-indigo-900">
                    <div className="absolute inset-0 bg-[url('/icons/lines.svg')] opacity-20 bg-cover bg-center" />
                    <div className="flex flex-col items-center justify-center h-full px-12 text-center text-white z-10 relative">
                        <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                            <div className="relative h-[100px] w-[100px]">
                                <Image
                                    src="/icons/logo.svg"
                                    fill
                                    alt="FinMan"
                                    className="brightness-0 invert drop-shadow-lg object-contain"
                                />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold mb-6 drop-shadow-md">Manage Your Finance with Confidence</h2>
                        <p className="text-lg text-blue-100 max-w-md mx-auto leading-relaxed">
                            FinMan helps you track your expenses, manage your savings, and plan for your future with our intelligent financial tools.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
