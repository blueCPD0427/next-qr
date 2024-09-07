import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { ConnectedMasterList } from "./connected-master-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default async function MemberMasterListPage()
{
    const session = await auth();
    let memberId = "";
    if(session?.user?.id != undefined){
        memberId = session.user.id;
    }
    const connectedMasterList = await prisma.masterToMemberRelations.findMany({
        select: {
            addressDisp: true,
            birthdayDisp: true,
            master: {
                select: {
                    id:true,
                    name:true,
                    postCode:true,
                    address:true,
                }
            },
            member:{
                select:{
                    confMemberData:{
                        select:{
                            oCCId:true,
                            configurationData:true,
                            customConfiguration:{
                                select:{
                                    configurationTitle:true
                                }
                            }
                        },
                    },
                },
            }
        },
        where: {
            memberId : memberId,
        }
    })

    return (
        <div>
            {
                connectedMasterList.length > 0 ?
                (
                    <ConnectedMasterList connectedMasterList={connectedMasterList} memberId={memberId} />
                ) : (
                    <Alert>
                        <AlertDescription>
                            <FontAwesomeIcon className="text-orange-500 font-bold mr-3" icon={faTriangleExclamation} />
                            連携先が存在しません。
                        </AlertDescription>
                    </Alert>
                )
            }
        </div>
    );
}