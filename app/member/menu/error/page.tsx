import Link from "next/link";

export default function MemberErrorPage({ searchParams }: { searchParams: { type: string } }){

    let errorMessage = '予期せぬエラーが発生しました。';
    switch(true){
        case searchParams.type == 'master-connect':
            errorMessage = '連携先店舗情報の取得に失敗しました。';
            break;
        case searchParams.type == 'already-connect':
            errorMessage = '既に連携済みの店舗です。';
            break;
        case searchParams.type == 'dis-account':
            errorMessage = 'アカウント情報の取得に失敗しました。';
            break;
    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-5 rounded">
                <div>
                    {errorMessage}
                </div>
                <div className="text-center mt-3">
                    <Link href="/member/menu" className="font-bold text-blue-500">
                        トップへ戻る
                    </Link>
                </div>
            </div>
        </div>
    )
}