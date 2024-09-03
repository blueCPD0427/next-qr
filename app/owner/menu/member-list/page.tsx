import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function OwnerMemberListPage()
{
    const session = await auth();
    let ownerId = "";
    if(session?.user?.id != undefined){
        ownerId = session.user.id;
    }
    const connectedMemberList = await prisma.ownerToCustomerRelations.findMany({
        select: {
            addressDisp: true,
            birthdayDisp: true,
            customer: {
                select: {
                    userId:true,
                    lastName:true,
                    firstName:true,
                    sex:true,
                    postCode:true,
                    address:true,
                    birthday:true,
                }
            }
        },
        where: {
            ownerId : ownerId,
        }
    })

    const customerSex = (sex?:string) => {
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

    // 各会員の現在のカスタムデータをクリックしたら表示できるようにする
    // 増えると画面が鬱陶しいから開閉式
    // 簡単な検索フォームくらいあってもいいかもしんない

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
                            <TableRow key={value.customer.userId}>
                                <TableCell className="w-1/5">
                                    {value.customer.lastName}
                                    {value.customer.firstName}
                                </TableCell>
                                <TableCell className="w-1/5">
                                    {
                                        value?.customer?.sex &&
                                        customerSex(value.customer.sex)
                                    }
                                </TableCell>
                                <TableCell className="w-2/5">
                                    {value.addressDisp === true ? value.customer.postCode + ' ' + value.customer.address : '住所非公開'}
                                </TableCell>
                                <TableCell className="w-1/5">
                                    {value.birthdayDisp === true ? String(value.customer.birthday) : '生年月日非公開'}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}