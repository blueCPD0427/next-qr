import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Dela_Gothic_One } from "next/font/google";
import { LogoutForm } from "@/app/lib/component-parts/buttons";
import { auth } from "@/auth";

const dela = Dela_Gothic_One({
    subsets: ["latin"],
    weight: "400"
})

export default async function OwnerLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        const session = await auth();

        return (
            <div>
                <header className="fixed top-0 left-0 w-full shadow-md z-50">
                    <div className="bg-blue-200 px-5 py-2 flex justify-between">
                        <h1 className={`${dela.className} text-lg`}>
                            <FontAwesomeIcon icon={faQrcode} />
                            QR君!!-オーナーズサイト-
                            <FontAwesomeIcon icon={faQrcode} />
                        </h1>
                        {
                            session != null && session.user?.type == 'owner'
                            &&
                            <div className="flex align-middle">
                                <div className="mr-5 p-1">
                                    <span className="font-bold">
                                        {session.user?.name}
                                    </span>
                                    様
                                </div>
                                <LogoutForm />
                            </div>
                        }
                    </div>
                </header>
                {children}
            </div>
        );
}
