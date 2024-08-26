import type { Metadata } from "next";
import AccountForm from "@/app/owner/account/account-form";

export const metadata: Metadata = {
    title: 'オーナーズサイト 新規登録'
};

export default function OwnerAcountCreatePage(){

    return (
        <div>
            <AccountForm />
        </div>
    )
}