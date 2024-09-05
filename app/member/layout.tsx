import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Dela_Gothic_One } from "next/font/google";
import { LogoutForm } from "@/app/lib/component-parts/buttons";
import { auth } from "@/auth";
import Link from "next/link";

const dela = Dela_Gothic_One({
    subsets: ["latin"],
    weight: "400"
})

export default async function MemberLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        const session = await auth();

        return (
            <div>
                <header className="fixed top-0 left-0 w-full shadow-md z-50">
                    <div className="bg-blue-200 px-5 py-2 flex justify-between">
                        <Link href={"/"} className={`${dela.className} text-lg`}>
                            <FontAwesomeIcon icon={faQrcode} />
                            QR君!!-メンバーサイト-
                            <FontAwesomeIcon icon={faQrcode} />
                        </Link>
                        {
                            session != null
                            &&
                            <div className="flex align-middle">
                                <LogoutForm />
                            </div>
                        }
                    </div>
                </header>
                {children}
            </div>
        );
}
