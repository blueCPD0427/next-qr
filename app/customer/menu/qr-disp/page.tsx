import { QrcodeGenerator } from "@/app/lib/component-parts/qrcode";
import { auth } from "@/auth";
import { CopyToClipboardButton } from "@/app/lib/component-parts/buttons";


export default async function OwnerQrDisplayPage()
{
    // QRコードに表示するURLを生成
    const session = await auth();
    const qrUrl = process.env.BASE_URL + 'customer/menu/connect?owner=' + session?.user?.id;

    return(
        <div className='flex justify-center items-center h-screen-80'>
            <div className=''>
                <div className="flex justify-center">
                    <QrcodeGenerator value={qrUrl}/>
                </div>
                <div className="mt-5">
                    こちらのＱＲコードを店舗様へ提示してください。
                </div>
            </div>
        </div>
    )
}