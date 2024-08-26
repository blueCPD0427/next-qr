import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";

export default async function OwnerMemberListPage()
{
    const session = await auth();
    let ownerId = "";
    if(session?.user?.id != undefined){
        ownerId = session.user.id;
    }
    const connectedMemberList = await prisma.ownertoCustomerRelations.findMany({
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

    return (
        <div className="bg-white rounded p-5 w-4/5">
            <div className="flex">
                <div className="w-1/5">
                    名前
                </div>
                <div className="w-1/5">
                    性別
                </div>
                <div className="w-2/5">
                    住所
                </div>
                <div className="w-1/5">
                    生年月日
                </div>
            </div>
            {
                connectedMemberList &&
                connectedMemberList.map((value) => (
                    <div key={value.customer.userId} className="flex">
                        <div className="w-1/5">
                            {value.customer.lastName}
                            {value.customer.firstName}
                        </div>
                        <div className="w-1/5">
                            {
                                value?.customer?.sex &&
                                customerSex(value.customer.sex)
                            }
                        </div>
                        <div className="w-2/5">
                            {value.addressDisp === true ? value.customer.postCode + ' ' + value.customer.address : '住所非公開'}
                        </div>
                        <div className="w-1/5">
                            {value.birthdayDisp === true ? String(value.customer.birthday) : '生年月日非公開'}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}