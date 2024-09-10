import { auth } from '@/auth';
import AccountForm from '@/app/master/account/account-form';
import { getEditMasterData } from '@/app/master/account/actions';
import { redirect } from 'next/navigation';

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

    return (
        <div>
            <AccountForm editMasterData={editMasterData} />
        </div>
    );
}
