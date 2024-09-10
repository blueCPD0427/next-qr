import { auth } from '@/auth';
import prisma from '@/app/lib/prisma';
import { ConnectedMasterList } from './connected-master-list';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Prisma } from '@prisma/client';

export type MasterToMemberRelationsListReturnType = Prisma.PromiseReturnType<
    typeof getMasterToMemberRelations
>;

async function getMasterToMemberRelations(memberId: string) {
    const connectedMasterList = await prisma.masterToMemberRelations.findMany({
        select: {
            addressDisp: true,
            birthdayDisp: true,
            master: {
                select: {
                    id: true,
                    name: true,
                    postCode: true,
                    address: true,
                },
            },
            member: {
                select: {
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
            memberId: memberId,
        },
    });

    return connectedMasterList;
}

export default async function MemberMasterListPage() {
    const session = await auth();
    let memberId = '';
    if (session?.user?.id != undefined) {
        memberId = session.user.id;
    }
    const connectedMasterList = await getMasterToMemberRelations(memberId);

    return (
        <div className="flex justify-center mt-20">
            {connectedMasterList.length > 0 ? (
                <ConnectedMasterList
                    connectedMasterList={connectedMasterList}
                    memberId={memberId}
                />
            ) : (
                <Alert>
                    <AlertDescription>
                        <FontAwesomeIcon
                            className="text-orange-500 font-bold mr-3"
                            icon={faTriangleExclamation}
                        />
                        連携先が存在しません。
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
