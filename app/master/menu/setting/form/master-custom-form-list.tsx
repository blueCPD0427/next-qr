'use client';

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
import { DeleteMasterCustomForm } from "@/app/lib/difinitions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MasterCustomFormList({mCClist,mCCTypes,masterId}:{mCClist:any,mCCTypes:any,masterId:string})
{
    const router = useRouter();
    const [sendPending, setSendPending] = useState(false);

    // 削除ボタン処理
    async function deleteCustomForm(formId:string){
        setSendPending(true);
        const deleteData:DeleteMasterCustomForm = {
            formId: formId,
            masterId: masterId,
        }

        const response = await fetch('/api/master-delete-custom-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteData),
        });
        const result = await response.json();
        if(result.data.success === false){
            toast.error('データ項目の削除に失敗しました。');
        }else{
            toast.success('データ項目の削除に成功しました。');
            router.refresh();
        }
        setSendPending(false);
    }


    return(
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
                    mCClist.map((mCC:any)=>(
                        <TableRow key={mCC.id}>
                            <TableCell className="w-2/5">
                                {mCC.configurationTitle}
                            </TableCell>
                            <TableCell className="w-2/5">
                                {mCCTypes[mCC.configurationConstraint]}
                            </TableCell>
                            <TableCell className="w-1/5">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" className="bg-red-500 hover:bg-red-700" aria-disabled={sendPending}>
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
                                                登録済みのメンバーデータも併せて削除されます。
                                                <br/>よろしいでしょうか
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                いいえ
                                            </AlertDialogCancel>
                                            <AlertDialogAction className="bg-green-500 hover:bg-green-700" onClick={() => deleteCustomForm(mCC.id)}>
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
    )

}