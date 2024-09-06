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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/5">名前</TableHead>
                        <TableHead className="w-1/5">性別</TableHead>
                        <TableHead className="w-2/5">住所</TableHead>
                        <TableHead className="w-1/5">生年月日</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        connectedMemberList &&
                        connectedMemberList.map((value) => (
                            <TableRow key={value.member.userId}>
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
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}