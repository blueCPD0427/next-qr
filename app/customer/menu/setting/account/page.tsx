import { auth } from "@/auth"
import AccountForm from "@/app/customer/account/account-form";
import { getEditCustomerData } from "@/app/customer/account/actions";
import { redirect } from "next/navigation";


export default async function SettingCustomerAccountPage()
{
    const session = await auth();
    const customerId = session?.user?.id;
    if(customerId == undefined){
        redirect('/404');
    }
    const editCustomerData = await getEditCustomerData(customerId);
    if(editCustomerData == null){
        redirect('/404');
    }

    return (
        <AccountForm editCustomerData={editCustomerData} />
    )
}