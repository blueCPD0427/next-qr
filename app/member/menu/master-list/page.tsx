import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { ConnectedShopList } from "./connected-master-list";

export default async function MemberShopListPage()
{
    const session = await auth();
    let memberId = "";
    if(session?.user?.id != undefined){
        memberId = session.user.id;
    }
    const connectedShopList = await prisma.masterToMemberRelations.findMany({
        select: {
            addressDisp: true,
            birthdayDisp: true,
            master: {
                select: {
                    userId:true,
                    name:true,
                    postCode:true,
                    address:true,
                }
            }
        },
        where: {
            memberId : memberId,
        }
    })

    return (
        <ConnectedShopList connectedShopList={connectedShopList} />
    );
}