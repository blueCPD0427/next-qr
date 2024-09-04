import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faUsers, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import clsx from "clsx";

export default function CustomerMenuLayout({
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
                                <Link href={'/customer/menu/qr-disp'} onClick={() => ClickLink('qr-disp')}>
                                    <FontAwesomeIcon icon={faQrcode} className="mr-2 text-xl w-5" />
                                    QRコードを表示
                                </Link>
                            </li>
                            <li className={clsx('py-2 pl-2',{'bg-indigo-100' : currentPage == 'shop-list'})}>
                                <Link href={'/customer/menu/shop-list'} onClick={() => ClickLink('shop-list')}>
                                <FontAwesomeIcon icon={faUsers} className="mr-2 text-xl w-5" />
                                    登録済み店舗一覧
                                </Link>
                            </li>
                            <li className={clsx('py-1 pl-2',{'bg-indigo-100' : currentPage == 'setting-account'})}>
                                <Link href={'/customer/menu/setting/account'} onClick={() => ClickLink('setting-account')}>
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