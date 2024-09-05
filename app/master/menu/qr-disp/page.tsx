import { QrcodeGenerator } from "@/app/lib/component-parts/qrcode";
import { auth } from "@/auth";
import { CopyToClipboardButton } from "@/app/lib/component-parts/buttons";


export default async function MasterQrDisplayPage()
{
    // QRコードに表示するURLを生成
    const session = await auth();
    const qrUrl = process.env.BASE_URL + 'member/menu/connect?master=' + session?.user?.id;

    return(
        <div className='flex justify-center items-center h-screen-80'>
            <div className=''>
                <div className="flex justify-center">
                    <QrcodeGenerator value={qrUrl}/>
                </div>
                <div className="mt-5">
                    こちらのＱＲコードをメンバー様に読み取っていただくことで、
                    アカウント連携が完了します
                </div>
                <div className="mt-1">
                    <span className="text-bold">
                        ※QRコードの読み取りができない場合は以下のURLにアクセスしていただいてください。
                    </span>
                    <br />
                    <span className="mr-1">
                        「{qrUrl}」
                    </span>
                    <CopyToClipboardButton value={qrUrl} />
                </div>
            </div>
        </div>
    )
}