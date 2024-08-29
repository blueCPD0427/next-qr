import { auth } from "@/auth";
import { getOwnersCustomConfigurations,getOwnerToCustomerRelations } from "../../actions";
import { redirect } from "next/navigation";
import TextCustomFormPage from "./text-form";


export default async function QrReadResultPage({params}: {params: {customerId:string}})
{
    const session = await auth();
    const owner = session?.user;
    if(owner?.type == '' || owner?.type != 'owner'){
        redirect('/404');
    }

    const ownerId = owner.id;
    if(ownerId == undefined || ownerId == ''){
        redirect('/404');
    }


    // 「OwnersCustomConfigurations」テーブルに設定が1コ以上存在するか確認。
    // 無ければエラー表示+エディット画面へのリンク
    const oCClist = await getOwnersCustomConfigurations(ownerId);
    if(!oCClist){
        // 連携情報が無いので先に連携を促す
        redirect('/404');
    }


    // 連携済み会員かどうかチェック
    // 連携済みであれば情報取得
    // 情報取得の際に「ConfigurationsCustomerData」の内容も取得
    const customerId = params.customerId;


    const oCRelationData = await getOwnerToCustomerRelations(ownerId, customerId);
    if(!oCRelationData){
        // 連携情報が無いので先に連携を促す
        redirect('/404');
    }

    // console.log(oCClist);

    // 「OwnersCustomConfigurations」に基づいてフォーム作成
    // 取得情報をUPDATEするフォームを表示
    // UPDATE処理を実行

    return (
        <div>
            読み取った結果反映

            {
                oCClist &&
                oCClist.map((oCC) => (
                    // ここでIDだけじゃなくて色々渡したい。既にデータがある場合は初期値とか
                    <TextCustomFormPage formId={oCC.id} />
                ))
            }


        </div>
    )
}