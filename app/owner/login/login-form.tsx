'use client';
import { authenticate } from "@/app/owner/account/actions";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { LoginButton } from "@/app/lib/component-parts/buttons";
import toast from "react-hot-toast";

export default function LoginForm(){
    const [state, formAction] = useFormState(authenticate, true);

    return(
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-green-700">ログイン</h2>
                <form action={formAction}>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2" htmlFor="id">ID</label>
                        <input
                            type="text"
                            id="id"
                            name="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-green-700 mb-2" htmlFor="password">パスワード</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    {
                        state === false &&
                        <p className="text-red-500 font-bold">
                            ログインに失敗しました。
                            <br />IDとパスワードを再確認してください。
                        </p>
                    }
                    <LoginButton />
                </form>
                <span className="inline-block w-full text-center">
                    ※新規登録は<Link href="/owner/account/create" className="font-bold text-blue-500">こちら</Link>から
                </span>
            </div>
        </div>
    )
}