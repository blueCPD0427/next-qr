'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faQrcode,
    faUsers,
    faUserPen,
} from '@fortawesome/free-solid-svg-icons';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
} from '@/components/ui/menubar';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { convertReplaceText } from '@/app/lib/actions/convert';

export default function MemberMenuLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 現在ページ管理
    const pathname = usePathname();
    const currentPage = convertReplaceText(pathname, '/member/menu/', '');

    return (
        <div className="mt-10">
            <div className="fixed top-12 left-0 w-full z-50 p-3 overflow-y-auto">
                <Menubar className="inline-block border-black">
                    <MenubarMenu>
                        <MenubarTrigger className="cursor-pointer">
                            Menu
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem
                                asChild
                                className={clsx('cursor-pointer', {
                                    'bg-indigo-300': currentPage == 'qr-disp',
                                })}
                            >
                                <Link href={'/member/menu/qr-disp'}>
                                    <FontAwesomeIcon
                                        icon={faQrcode}
                                        className="mr-2 text-xl w-5"
                                    />
                                    QRコードを表示
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                                asChild
                                className={clsx('cursor-pointer', {
                                    'bg-indigo-300':
                                        currentPage == 'master-list',
                                })}
                            >
                                <Link href={'/member/menu/master-list'}>
                                    <FontAwesomeIcon
                                        icon={faUsers}
                                        className="mr-2 text-xl w-5"
                                    />
                                    連携先一覧
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                                asChild
                                className={clsx('cursor-pointer', {
                                    'bg-indigo-300':
                                        currentPage == 'setting/account',
                                })}
                            >
                                <Link href={'/member/menu/setting/account'}>
                                    <FontAwesomeIcon
                                        icon={faUserPen}
                                        className="mr-2 text-xl w-5"
                                    />
                                    アカウント設定
                                </Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
            <div className="w-full p-5 fix-scroll overflow-auto min-h-screen bg-green-100">
                {children}
            </div>
        </div>
    );
}
