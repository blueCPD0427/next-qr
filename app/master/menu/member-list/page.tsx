import { auth } from '@/auth';
import prisma from '@/app/lib/prisma';
import ConnectedMemberList from './connected-member-list';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Prisma } from '@prisma/client';

export type ConnectedMemberListReturnType = Prisma.PromiseReturnType<typeof getConnectedMemberList>;

async function getConnectedMemberList(masterId:string){
    const connectedMemberList = await prisma.masterToMemberRelations.findMany({
        select: {
            addressDisp: true,
            birthdayDisp: true,
            member: {
                select: {
                    id: true,
                    lastName: true,
                    firstName: true,
                    sex: true,
                    postCode: true,
                    address: true,
                    birthday: true,
                    confMemberData: {
                        select: {
                            mCCId: true,
                            configurationData: true,
                            customConfiguration: {
                                select: {
                                    configurationTitle: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
            },
        },
        where: {
            masterId: masterId,
        },
    });

    return connectedMemberList;
}

export default async function MasterMemberListPage() {
    const session = await auth();
    let masterId = '';
    if (session?.user?.id != undefined) {
        masterId = session.user.id;
    }
    const connectedMemberList = await getConnectedMemberList(masterId);

    return (
        <div className="flex justify-center mt-20">
            {connectedMemberList.length > 0 ? (
                <ConnectedMemberList
                    connectedMemberList={connectedMemberList}
                />
            ) : (
                <Alert>
                    <AlertDescription>
                        <FontAwesomeIcon
                            className="text-orange-500 font-bold mr-3"
                            icon={faTriangleExclamation}
                        />
                        連携済みのメンバーがまだいません。
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
