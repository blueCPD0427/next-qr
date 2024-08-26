import type { Metadata } from "next";
import LoginForm from "@/app/customer/login/login-form";

export const metadata: Metadata = {
    title: '会員サイト ログイン'
};

export default function CustomerLoginPage(){
    return (
        <div>
            <LoginForm />
        </div>
    )
}