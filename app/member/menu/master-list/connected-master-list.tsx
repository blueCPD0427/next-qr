'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import clsx from "clsx";

export function ConnectedMasterList({connectedMasterList}:{connectedMasterList:any})
{

    const [sendPending, setSendPending] = useState(false);



    const toggleDispData = (masterId:string, target:string) => {
        console.log(masterId);
        console.log(target);


        
    }

    return (
        <div className="bg-white rounded">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/5">連携先</TableHead>
                        <TableHead className="w-2/5">住所</TableHead>
                        <TableHead className="w-1/5">住所の公開</TableHead>
                        <TableHead className="w-1/5">生年月日の公開</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        connectedMasterList &&
                        connectedMasterList.map((value) => (
                            <TableRow key={value.master.id}>
                                <TableCell className="w-1/5">
                                    {value.master.name}
                                </TableCell>
                                <TableCell className="w-2/5">
                                    {value.master.address}
                                </TableCell>
                                <TableCell className="w-1/5">
                                    <div className="flex justify-between items-center px-3">
                                        <span>{value.addressDisp === true ? '公開' : '非公開'}</span>
                                        <Button
                                            type="button"
                                            className={clsx('font-bold bg-orange-500 hover:bg-orange-700',{'bg-blue-500 hover:bg-blue-700' : value.addressDisp === true})}
                                            aria-disabled={sendPending}
                                            onClick={() => toggleDispData(value.master.id, 'addressDisp')}
                                        >
                                            {value.addressDisp === true ? '非公開に変更' : '公開に変更'}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="w-1/5">
                                    <div className="flex justify-between items-center px-3">
                                        <span>{value.birthdayDisp === true ? '公開' : '非公開'}</span>
                                        <Button
                                            type="button"
                                            className={clsx('font-bold bg-orange-500 hover:bg-orange-700',{'bg-blue-500 hover:bg-blue-700' : value.birthdayDisp === true})}
                                            aria-disabled={sendPending}
                                            onClick={() => toggleDispData(value.master.id, 'birthdayDisp')}
                                        >
                                            {value.birthdayDisp === true ? '非公開に変更' : '公開に変更'}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )

}