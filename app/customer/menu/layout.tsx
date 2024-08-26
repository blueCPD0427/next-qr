import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faExpand, faUsers, faGear } from "@fortawesome/free-solid-svg-icons";

export default function CustomerMenuLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        return(
            <div className="flex-1 flex mt-10">
                <div className="w-1/6 border p-5 overflow-y-auto bg-yellow-50">
                    <div>
                        <ul className="font-bold">
                            <li className="py-2">
                                <Link href={'/customer/menu/qr-disp'}>
                                    <FontAwesomeIcon icon={faQrcode} className="mr-2 text-xl w-5" />
                                    QRコードを表示
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href={'/customer/menu/shop-list'}>
                                <FontAwesomeIcon icon={faUsers} className="mr-2 text-xl w-5" />
                                    登録済み店舗一覧
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href={'/customer/menu/setting'}>
                                <FontAwesomeIcon icon={faGear} className="mr-2 text-xl w-5" />
                                    各種設定
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