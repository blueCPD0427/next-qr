import { auth } from '@/auth';
import {
    getMastersCustomConfigurations,
    getMasterToMemberRelations,
} from '../../actions';
import { redirect } from 'next/navigation';
import CustomFormBase from './custom-form';
import prisma from '@/app/lib/prisma';
import {
    MastersCustomConfigurationsReturnType,
    MasterToMemberRelationsReturnType,
} from '../../actions';

export default async function QrReadResultPage({
    params,
}: {
    params: { memberId: string };
}) {
    const session = await auth();
    const master = session?.user;
    if (master?.type == '' || master?.type != 'master') {
        redirect('/404');
    }

    const masterId = master.id;
    if (masterId == undefined || masterId == '') {
        redirect('/404');
    }

    const memberId = params.memberId;

    const oCRelationData: MasterToMemberRelationsReturnType =
        await getMasterToMemberRelations(masterId, memberId);
    if (!oCRelationData) {
        // 連携情報が無いので先に連携を促す
        redirect('/404');
    }

    const mCClist: MastersCustomConfigurationsReturnType =
        await getMastersCustomConfigurations(masterId, memberId);
    if (!mCClist) {
        // 無ければエラー表示+エディット画面へのリンク
        redirect('/404');
    }

    const memberData = await prisma.members.findFirst({
        where: {
            id: memberId,
        },
        select: {
            id: true,
            lastName: true,
            firstName: true,
        },
    });
    if (!memberData) {
        redirect('/404');
    }

    const memberName = memberData.lastName + ' ' + memberData.firstName;

    // ↓使ってまとめてformDataとして送って保存する

    return (
        <div>
            <CustomFormBase
                mCClist={mCClist}
                memberId={memberId}
                memberName={memberName}
            />
        </div>
    );
}
