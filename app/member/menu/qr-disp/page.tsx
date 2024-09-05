import { QrcodeGenerator } from "@/app/lib/component-parts/qrcode";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function MasterQrDisplayPage()
{
    // QRコードに表示するURLを生成
    const session = await auth();

    let qrUrl = '';
    if(session?.user?.id == undefined){
        redirect('/404');
    }else{
        qrUrl = session.user.id;
    }

    return(
        <div className='flex justify-center items-center h-screen-80'>
            <div className=''>
                <div className="flex justify-center">
                    <QrcodeGenerator value={qrUrl}/>
                </div>
                <div className="mt-5">
                    こちらのＱＲコードを連携先へ提示してください。
                </div>
            </div>
        </div>
    )
}