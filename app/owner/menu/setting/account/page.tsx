import { auth } from "@/auth"
import AccountForm from "@/app/owner/account/account-form"

export default async function SettingAccountPage()
{
    const session = await auth();
    const ownerId = session?.user?.id;

    return (
        <div>
            <AccountForm ownerId={ownerId} />
        </div>
    )
}