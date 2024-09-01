import { auth } from "@/auth"
import AccountForm from "@/app/owner/account/account-form"
import { getEditOwnerData } from "@/app/owner/account/actions";
import { redirect } from "next/navigation";

export default async function SettingAccountPage()
{
    const session = await auth();
    const ownerId = session?.user?.id;
    if(ownerId == undefined){
        redirect('/404');
    }
    const editOwnerData = await getEditOwnerData(ownerId);
    console.log(editOwnerData);

    return (
        <div>
            <AccountForm editOwnerData={editOwnerData} />
        </div>
    )
}