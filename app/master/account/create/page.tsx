import type { Metadata } from "next";
import AccountForm from "@/app/master/account/account-form";

export const metadata: Metadata = {
    title: 'マスターズサイト 新規登録'
};

export default function MasterAcountCreatePage(){

    return (
        <div className="bg-green-100">
            <AccountForm />
        </div>
    )
}