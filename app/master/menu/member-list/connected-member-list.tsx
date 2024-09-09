'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { convertDate } from "@/app/lib/actions/convert";
import React from "react";

export default function ConnectedMemberList({connectedMemberList}:{connectedMemberList:any})
{

    const memberSex = (sex?:string) => {
        switch(true){
            case sex == 'male':
                return '男性';
                break;
            case sex == 'female':
                return '女性';
                break;
            case sex == '':
                return '';
                break;
        }
    }

    return (
        <div className="bg-white rounded p-5 w-4/5">
            <Table className="whitespace-nowrap">
                <TableHeader>
                    <TableRow className="border-black">
                        <TableHead className="w-1/5">名前</TableHead>
                        <TableHead className="w-1/5">性別</TableHead>
                        <TableHead className="w-2/5">住所</TableHead>
                        <TableHead className="w-1/5">生年月日</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        connectedMemberList &&
                        connectedMemberList.map((value:any) => (
                            <React.Fragment key={value.member.id}>
                                <TableRow className="border-b-0 border-black">
                                    <TableCell className="w-1/5">
                                        {value.member.lastName}
                                        {value.member.firstName}
                                    </TableCell>
                                    <TableCell className="w-1/5">
                                        {
                                            value?.member?.sex &&
                                            memberSex(value.member.sex)
                                        }
                                    </TableCell>
                                    <TableCell className="w-2/5">
                                        {value.addressDisp === true ? value.member.postCode + ' ' + value.member.address : '住所非公開'}
                                    </TableCell>
                                    <TableCell className="w-1/5">
                                        {value.birthdayDisp === true ? convertDate(value.member.birthday) : '生年月日非公開'}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="border-black">
                                    <TableCell colSpan={4}>
                                        <div>
                                            現在の登録データ：
                                        </div>
                                        <div className="flex align-middle">
                                            {
                                                value.member.confMemberData.length > 0 ?
                                                (
                                                    value.member.confMemberData.map((cMData:any) => (
                                                        cMData.customConfiguration.configurationTitle &&
                                                        (
                                                            <div key={cMData.mCCId}>
                                                                【{cMData.customConfiguration.configurationTitle}】
                                                                [{cMData.configurationData}]
                                                            </div>
                                                        )
                                                    ))
                                                ) : (
                                                    <div>
                                                        現在登録されているデータはありません
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}