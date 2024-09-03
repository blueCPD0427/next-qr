import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import OwnerCustomForm from "./owner-custome-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


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
            <div className="mb-5">
                <div>
                    登録済みの項目
                </div>
                <div className="bg-white rounded p-3 w-1/3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">データ名</TableHead>
                                <TableHead className="w-1/2">データの形式</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                oCClist.map((oCC)=>(
                                    <TableRow key={oCC.id}>
                                        <TableCell className="w-1/2">{oCC.configurationTitle}</TableCell>
                                        <TableCell className="w-1/2">{oCCTypes[oCC.configurationConstraint]}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
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