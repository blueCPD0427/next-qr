import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faExpand, faUsers, faGear, faShop, faUserPen } from "@fortawesome/free-solid-svg-icons";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function OwnerMenuLayout({
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
                                <Link href={'/owner/menu/qr-disp'}>
                                    <FontAwesomeIcon icon={faQrcode} className="mr-2 text-xl w-5" />
                                    店舗QRコードを表示
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href={'/owner/menu/qr-read'}>
                                <FontAwesomeIcon icon={faExpand} className="mr-2 text-xl w-5" />
                                    QR読み取り
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href={'/owner/menu/member-list'}>
                                <FontAwesomeIcon icon={faUsers} className="mr-2 text-xl w-5" />
                                    連携済み会員一覧
                                </Link>
                            </li>
                            <li className="py-2">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <FontAwesomeIcon icon={faGear} className="mr-2 text-xl w-5" />
                                            各種設定
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <Link href={'/owner/menu/setting/account'}>
                                                <FontAwesomeIcon icon={faShop} className="mr-2 text-xl w-5" />
                                                アカウント設定
                                            </Link>
                                        </AccordionContent>
                                        <AccordionContent>
                                            <Link href={'/owner/menu/setting/form'}>
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