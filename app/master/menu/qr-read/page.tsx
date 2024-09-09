'use server';
import QrRead from '@/app/master/menu/qr-read/qr-read';
import prisma from '@/app/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export default async function MasterQrReadPage() {
    const session = await auth();
    const masterId = session?.user?.id;
    if(masterId == undefined){
        redirect('/404');
    }

    /**
     * フォームの登録が無い場合はリダイレクトさせる。
     * トーストで文字を出したいのでclient側に情報を渡す
     */
    const mCCCount = await prisma.mastersCustomConfigurations.count({
        where : {
            masterId: masterId
        }
    })

    return(
        <div className='mt-20'>
            {
                mCCCount > 0 ?(
                    <QrRead />
                ) : (
                    <Alert>
                        <AlertDescription>
                            <FontAwesomeIcon className="text-orange-500 font-bold mr-3" icon={faTriangleExclamation} />
                            <Link href={'/master/menu/setting/form'} className='font-bold text-blue-500 underline'>
                                メンバーデータ項目設定
                            </Link>
                            を先に行ってください
                        </AlertDescription>
                    </Alert>
                )
            }
        </div>
    )
}