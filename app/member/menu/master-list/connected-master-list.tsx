'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function ConnectedShopList({connectedShopList}:{connectedShopList:any})
{

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/5">店舗</TableHead>
                    <TableHead className="w-2/5">住所</TableHead>
                    <TableHead className="w-1/5">住所の公開</TableHead>
                    <TableHead className="w-1/5">生年月日の公開</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    connectedShopList &&
                    connectedShopList.map((value) => (
                        <TableRow key={value.master.userId}>
                            <TableCell className="w-1/5">
                                {value.master.name}
                            </TableCell>
                            <TableCell className="w-2/5">
                                {value.master.address}
                            </TableCell>
                            <TableCell className="w-1/5">
                                {value.addressDisp === true ? '公開' : '非公開'}
                            </TableCell>
                            <TableCell className="w-1/5">
                                {value.birthdayDisp === true ? '公開' : '非公開'}
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )

}