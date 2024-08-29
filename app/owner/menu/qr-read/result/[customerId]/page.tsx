import { auth } from "@/auth";
import { getOwnersCustomConfigurations,getOwnerToCustomerRelations } from "../../actions";
import { redirect } from "next/navigation";
import TextCustomFormPage from "@/app/owner/menu/qr-read/result/[customerId]/text-form";
import IntCustomFormPage from "@/app/owner/menu/qr-read/result/[customerId]/int-form";
import BooleanCustomFormPage from "@/app/owner/menu/qr-read/result/[customerId]/boolean-form";
import { useFormState } from "react-dom";


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

    const customerId = params.customerId;


    const oCRelationData = await getOwnerToCustomerRelations(ownerId, customerId);
    if(!oCRelationData){
        // 連携情報が無いので先に連携を促す
        redirect('/404');
    }

    const oCClist = await getOwnersCustomConfigurations(ownerId, customerId);
    if(!oCClist){
        // 無ければエラー表示+エディット画面へのリンク
        redirect('/404');
    }

    // ↓使ってまとめてformDataとして送って保存する
    // const [result, dispatch] = useFormState(createAccount, initialState);
    return (
        <div>
            <form>
            {
                oCClist && oCClist.map((oCC) => {
                    switch (oCC.configurationConstraint) {
                        case 'text':
                            return <TextCustomFormPage key={oCC.id} oCCData={oCC} />;
                        case 'int':
                            return <IntCustomFormPage key={oCC.id} oCCData={oCC} />;
                        case 'boolean':
                            return <BooleanCustomFormPage key={oCC.id} oCCData={oCC} />;
                        default:
                            return null;
                    }
                })
            }
            </form>
        </div>
    )
}