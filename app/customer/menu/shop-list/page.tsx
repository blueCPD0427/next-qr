import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { ConnectedShopList } from "./connected-shop-list";

export default async function CustomerShopListPage()
{
    const session = await auth();
    let customerId = "";
    if(session?.user?.id != undefined){
        customerId = session.user.id;
    }
    const connectedShopList = await prisma.ownerToCustomerRelations.findMany({
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
        <ConnectedShopList connectedShopList={connectedShopList} />
    );
}