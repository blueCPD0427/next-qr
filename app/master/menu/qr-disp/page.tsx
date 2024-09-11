import { QrcodeGenerator } from '@/app/lib/component-parts/qrcode';
import { auth } from '@/auth';
import { CopyToClipboardButton } from '@/app/lib/component-parts/buttons';

export default async function MasterQrDisplayPage({
    searchParams,
}: {
    searchParams?: { disConnect?: string };
}) {
    // QRコードに表示するURLを生成
    const session = await auth();
    const qrUrl =
        process.env.BASE_URL +
        'member/menu/connect?master=' +
        session?.user?.id;

    return (
        <div className="flex justify-center items-center h-screen-80">
            <div>
                {searchParams != undefined &&
                    searchParams.disConnect != undefined &&
                    searchParams.disConnect == 'true' && (
                        <div className="w-full text-center mb-5">
                            <p className="text-red-500 font-bold text-lg">
                                まだ連携処理を行っていないメンバーです。
                                <br />
                                以下QRコードを提示して連携を行ってください。
                            </p>
                        </div>
                    )}
                <div className="">
                    <div className="flex justify-center">
                        <QrcodeGenerator value={qrUrl} />
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
                        <span className="mr-1">「{qrUrl}」</span>
                        <CopyToClipboardButton value={qrUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
}
