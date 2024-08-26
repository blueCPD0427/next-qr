import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";

export default async function CustomerShopListPage()
{
    const session = await auth();
    let customerId = "";
    if(session?.user?.id != undefined){
        customerId = session.user.id;
    }
    const connectedShopList = await prisma.ownertoCustomerRelations.findMany({
        select: {
            addressDisp: true,
            birthdayDisp: true,
            owner: {
                select: {
                    userId:true,
                    name:true,
                    postCode:true,
                    address:true,
                }
            }
        },
        where: {
            customerId : customerId,
        }
    })

    return (
        <div className="bg-white rounded p-5 w-4/5">
            <div className="flex">
                <div className="w-1/3">
                    店舗
                </div>
                <div className="w-2/3">
                    住所
                </div>
            </div>
            {
                connectedShopList &&
                connectedShopList.map((value) => (
                    <div key={value.owner.userId} className="flex">
                        <div className="w-1/3">
                            {value.owner.name}
                        </div>
                        <div className="w-2/3">
                            {value.owner.address}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}