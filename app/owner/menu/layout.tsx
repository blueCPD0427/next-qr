'use client';

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faExpand, faUsers, faGear, faShop, faUserPen } from "@fortawesome/free-solid-svg-icons";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import clsx from "clsx";

export default function OwnerMenuLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {

        // 現在ページ管理
        const [currentPage, setCurrentPage] = useState('');
        const ClickLink = (pageName:string) => {
            setCurrentPage(pageName);
        }

        return(
            <div className="flex-1 flex mt-10">
                <div className="w-1/6 border p-5 overflow-y-auto bg-yellow-50">
                    <div>
                        <ul className="font-bold">
                            <li className={clsx('py-2 pl-2',{'bg-indigo-100' : currentPage == 'qr-disp'})}>
                                <Link href={'/owner/menu/qr-disp'} onClick={() => ClickLink('qr-disp')}>
                                    <FontAwesomeIcon icon={faQrcode} className="mr-2 text-xl w-5" />
                                    店舗QRコードを表示
                                </Link>
                            </li>
                            <li className={clsx('py-2 pl-2',{'bg-indigo-100' : currentPage == 'qr-read'})}>
                                <Link href={'/owner/menu/qr-read'} onClick={() => ClickLink('qr-read')}>
                                    <FontAwesomeIcon icon={faExpand} className="mr-2 text-xl w-5" />
                                    QR読み取り
                                </Link>
                            </li>
                            <li className={clsx('py-2 pl-2',{'bg-indigo-100' : currentPage == 'member-list'})}>
                                <Link href={'/owner/menu/member-list'} onClick={() => ClickLink('member-list')}>
                                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-xl w-5" />
                                    連携済み会員一覧
                                </Link>
                            </li>
                            <li className="py-2 pl-2">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <FontAwesomeIcon icon={faGear} className="mr-2 text-xl w-5" />
                                            各種設定
                                        </AccordionTrigger>
                                        <AccordionContent className={clsx('py-1 pl-2',{'bg-indigo-100' : currentPage == 'setting-account'})}>
                                            <Link href={'/owner/menu/setting/account'} onClick={() => ClickLink('setting-account')}>
                                                <FontAwesomeIcon icon={faShop} className="mr-2 text-xl w-5" />
                                                アカウント設定
                                            </Link>
                                        </AccordionContent>
                                        <AccordionContent className={clsx('py-1 pl-2',{'bg-indigo-100' : currentPage == 'setting-form'})}>
                                            <Link href={'/owner/menu/setting/form'} onClick={() => ClickLink('setting-form')}>
                                                <FontAwesomeIcon icon={faUserPen} className="mr-2 text-xl w-5" />
                                                会員データ項目設定
                                            </Link>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
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