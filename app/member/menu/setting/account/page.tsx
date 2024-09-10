import { auth } from '@/auth';
import AccountForm from '@/app/member/account/account-form';
import { getEditMemberData } from '@/app/member/account/actions';
import { redirect } from 'next/navigation';
import { MemberAccountFormEdit } from '@/app/lib/difinitions';

export default async function SettingMemberAccountPage() {
    const session = await auth();
    const memberId = session?.user?.id;
    if (memberId == undefined) {
        redirect('/404');
    }
    const editMemberData = await getEditMemberData(memberId);
    if (editMemberData == null) {
        redirect('/404');
    }

    const setEditMemberData: MemberAccountFormEdit = editMemberData;

    return <AccountForm editMemberData={setEditMemberData} />;
}
