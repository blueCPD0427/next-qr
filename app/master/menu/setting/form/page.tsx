import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import MasterCustomFormComponent from "./master-custom-form";
import MasterCustomFormList from "./master-custom-form-list";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";


export default async function SettingFormPage()
{
    const session = await auth();
    const masterId = session?.user?.id;
    if(masterId == undefined){
        redirect('/404');
    }

    const oCClist = await prisma.mastersCustomConfigurations.findMany({
        where : {
            masterId: masterId
        },
        select : {
            id: true,
            masterId: true,
            configurationTitle: true,
            configurationConstraint: true,
        },
    })

    const oCCTypes = {
        text: "テキスト",
        int: "数値",
        boolean: "ON/OFF",
    }

    // 各メンバーの現在のカスタムデータをクリックしたら表示できるようにする
    // 増えると画面が鬱陶しいから開閉式
    // 簡単な検索フォームくらいあってもいいかもしんない

    return (
        <div>
            <div className="mb-5">
                <div>
                    <div>
                        登録済みの項目
                    </div>
                    {
                        oCClist.length > 0 ?
                        (
                            <div className="bg-white rounded p-3 w-1/3">
                                <MasterCustomFormList oCClist={oCClist} oCCTypes={oCCTypes} masterId={masterId} />
                            </div>
                        ):(
                            <Alert className="bg-white p-3 w-1/3">
                                <AlertDescription>
                                    <FontAwesomeIcon className="text-orange-500 font-bold mr-3" icon={faTriangleExclamation} />
                                    登録されているフォームはありません。
                                </AlertDescription>
                            </Alert>
                        )
                    }
                </div>
            </div>
            {
                oCClist.length >= 5 ?
                (
                    <Alert>
                        <AlertDescription>
                            <FontAwesomeIcon className="text-orange-500 font-bold mr-3" icon={faTriangleExclamation} />
                            フォーム追加の上限に達したため、新規追加はできません
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="mt-5">
                        <div>
                            新規登録
                            <span className="text-sm font-bold">
                                ※最大5つまで
                            </span>
                        </div>
                        <div>
                            <MasterCustomFormComponent oCCTypes={oCCTypes} masterId={masterId} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}