import type { Metadata } from "next";
import AccountForm from "@/app/member/account/account-form";

export const metadata: Metadata = {
    title: 'マスターズサイト 新規登録'
};

export default function MasterAcountCreatePage(){

    return (
        <div>
            <AccountForm />
        </div>
    )
}