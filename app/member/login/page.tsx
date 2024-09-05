import type { Metadata } from "next";
import LoginForm from "@/app/member/login/login-form";

export const metadata: Metadata = {
    title: 'メンバーサイト ログイン'
};

export default function MemberLoginPage(){
    return (
        <div>
            <LoginForm />
        </div>
    )
}