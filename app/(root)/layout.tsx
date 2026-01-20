import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { BankProvider } from "@/context/BankContext";
import { user } from "@/constants";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const loggedIn = user;

    return (
        <main className="flex h-screen w-full font-inter">
            <Sidebar user={loggedIn} />

            <div className="flex size-full flex-col">
                <div className="root-layout">
                    <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
                    <div>
                        <MobileNav user={loggedIn} />
                    </div>
                </div>
                <BankProvider>
                    {children}
                </BankProvider>
            </div>
        </main>
    );
}
