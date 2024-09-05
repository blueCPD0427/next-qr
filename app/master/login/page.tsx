import type { Metadata } from "next";
import LoginForm from "@/app/master/login/login-form";

export const metadata: Metadata = {
    title: 'マスターズサイト ログイン'
};

export default function MasterLoginPage(){
    return (
        <div>
            <LoginForm />
        </div>
    )
}