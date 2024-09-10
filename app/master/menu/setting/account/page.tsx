import { auth } from '@/auth';
import AccountForm from '@/app/master/account/account-form';
import { getEditMasterData } from '@/app/master/account/actions';
import { redirect } from 'next/navigation';
import { MasterAccountFormEdit } from '@/app/lib/difinitions';

export default async function SettingMasterAccountPage() {
    const session = await auth();
    const masterId = session?.user?.id;
    if (masterId == undefined) {
        redirect('/404');
    }
    const editMasterData = await getEditMasterData(masterId);
    if (editMasterData == null) {
        redirect('/404');
    }

    const setEditMasterData: MasterAccountFormEdit = editMasterData;

    return (
        <div>
            <AccountForm editMasterData={setEditMasterData} />
        </div>
    );
}
