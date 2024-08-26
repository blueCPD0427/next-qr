export default function QrReadResultPage({params}: {params: {customerId:string}})
{
    const customerId = params.customerId;

    // 連携済み会員かどうかチェック
    // 連携済みであれば情報取得
    // 取得情報をUPDATEするフォームを表示
    // UPDATE処理を実行

    return (
        <div>
            読み取った結果反映
        </div>
    )
}