import type { Metadata } from "next";
import LoginForm from "@/app/owner/login/login-form";

export const metadata: Metadata = {
    title: 'オーナーズサイト ログイン'
};

export default function OwnerLoginPage(){
    return (
        <div>
            <LoginForm />
        </div>
    )
}