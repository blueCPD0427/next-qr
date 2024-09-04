import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import OwnerCustomFormComponent from "./owner-custom-form";
import OwnerCustomFormList from "./owner-custom-form-list";
import { redirect } from "next/navigation";


export default async function SettingFormPage()
{
    const session = await auth();
    const ownerId = session?.user?.id;
    if(ownerId == undefined){
        redirect('/404');
    }

    const oCClist = await prisma.ownersCustomConfigurations.findMany({
        where : {
            ownerId: ownerId
        },
        select : {
            id: true,
            ownerId: true,
            configurationTitle: true,
            configurationConstraint: true,
        },
    })

    const oCCTypes = {
        text: "テキスト",
        int: "数値",
        boolean: "ON/OFF",
    }


    return (
        <div>
            <div className="mb-5">
                <div>
                    登録済みの項目
                </div>
                <div className="bg-white rounded p-3 w-1/3">
                    <OwnerCustomFormList oCClist={oCClist} oCCTypes={oCCTypes} ownerId={ownerId} />
                </div>
            </div>
            {
                oCClist.length >= 5 ?
                (
                    <div>
                        フォーム追加の上限に達したため、新規追加はできません
                    </div>
                ) : (
                    <div className="mt-5">
                        <div>
                            新規登録
                            <span className="text-sm font-bold">
                                ※最大5つまで
                            </span>
                        </div>
                        <div>
                            <OwnerCustomFormComponent oCCTypes={oCCTypes} ownerId={ownerId} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}