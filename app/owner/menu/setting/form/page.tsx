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
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";


export default async function SettingFormPage()
{
    const session = await auth();
    const ownerId = session?.user?.id;

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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-2/5">データ名</TableHead>
                                <TableHead className="w-2/5">データの形式</TableHead>
                                <TableHead className="w-1/5"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                oCClist.map((oCC)=>(
                                    <TableRow key={oCC.id}>
                                        <TableCell className="w-2/5">
                                            {oCC.configurationTitle}
                                        </TableCell>
                                        <TableCell className="w-2/5">
                                            {oCCTypes[oCC.configurationConstraint]}
                                        </TableCell>
                                        <TableCell className="w-1/5">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button type="button" className="bg-red-500 hover:bg-red-700">
                                                        削除
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            <span className="text-red-500 font-bold">
                                                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                                                    一度削除した内容は復元ができません
                                                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                                            </span>
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="text-lg text-black">
                                                            登録済みの会員データも併せて削除されます。
                                                            <br/>よろしいでしょうか
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            いいえ
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction className="bg-green-500 hover:bg-green-700">
                                                            はい
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
            {
                oCClist.length > 5 ?
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
                            <OwnerCustomForm oCCTypes={oCCTypes} ownerId={ownerId} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}