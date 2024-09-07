'use client';

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faUsers, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { convertReplaceText } from "@/app/lib/actions/convert";

export default function MemberMenuLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {

        // 現在ページ管理
        const pathname = usePathname();
        const currentPage = convertReplaceText(pathname,'/member/menu/','')

        return(
            <div className="flex-1 flex mt-10">
                <div className="w-1/6 border p-5 overflow-y-auto bg-yellow-50">
                    <div>
                        <ul className="font-bold">
                            <li className={clsx('py-2 pl-2',{'bg-indigo-100' : currentPage == 'qr-disp'})}>
                                <Link href={'/member/menu/qr-disp'}>
                                    <FontAwesomeIcon icon={faQrcode} className="mr-2 text-xl w-5" />
                                    QRコードを表示
                                </Link>
                            </li>
                            <li className={clsx('py-2 pl-2',{'bg-indigo-100' : currentPage == 'master-list'})}>
                                <Link href={'/member/menu/master-list'}>
                                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-xl w-5" />
                                    連携先一覧
                                </Link>
                            </li>
                            <li className={clsx('py-1 pl-2',{'bg-indigo-100' : currentPage == 'setting/account'})}>
                                <Link href={'/member/menu/setting/account'}>
                                    <FontAwesomeIcon icon={faUserPen} className="mr-2 text-xl w-5" />
                                    アカウント設定
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-5/6 p-5 fix-scroll overflow-auto min-h-screen bg-green-100">
                    {children}
                </div>
            </div>
        )
}