import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import OwnerCustomForm from "./owner-custome-form";


export default async function SettingFormPage()
{
    const session = await auth();

    const oCClist = await prisma.ownersCustomConfigurations.findMany({
        where : {
            ownerId: session?.user?.id
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
            <div>
                <div>
                    登録済みの項目
                </div>
                <div className="flex w-1/3">
                    <div className="w-1/2">
                        データ名
                    </div>
                    <div className="w-1/2">
                        データの形式
                    </div>
                </div>
                {
                    oCClist.map((oCC)=>(
                        <div key={oCC.id} className="flex w-1/3">
                            <div className="w-1/2">
                                {oCC.configurationTitle}
                            </div>
                            <div className="w-1/2">
                                {oCCTypes[oCC.configurationConstraint]}
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="mt-5">
                <div>
                    新規登録
                    <span className="text-sm font-bold">
                        ※最大5つまで
                    </span>
                </div>
                <div>
                    <OwnerCustomForm oCCTypes={oCCTypes} />
                </div>
            </div>
        </div>
    )
}