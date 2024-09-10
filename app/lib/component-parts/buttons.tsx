'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

export function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className={clsx(
                'w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500',
                {
                    'opacity-50 cursor-wait': pending === true,
                },
            )}
            aria-disabled={pending}
        >
            {pending ? 'ログイン中' : 'ログイン'}
        </button>
    );
}

export function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className={clsx(
                'border rounded py-1 px-3 bg-green-500 text-white font-bold',
                {
                    'opacity-50 cursor-wait': pending === true,
                },
            )}
            aria-disabled={pending}
        >
            {pending ? '送信中' : '送信'}
        </button>
    );
}

export async function LogOutAction() {
    await signOut({ redirect: false });
    // サインアウト後に強制的にリダイレクトを実行しないとセッションが切れない
    window.location.href = '/';
    return true;
}

function LogoutButton() {
    const { pending } = useFormStatus();
    return (
        <button className="border rounded py-1 px-2 flex">
            <FontAwesomeIcon
                icon={pending ? faDoorOpen : faDoorClosed}
                className="inline-block h-[20px] mr-1"
            />
            <span
                className={clsx('hidden sm:inline-block font-bold', {
                    'opacity-50 cursor-wait': pending === true,
                })}
            >
                {pending ? 'ログアウト中' : 'ログアウト'}
            </span>
        </button>
    );
}

export function LogoutForm() {
    const [state, logOutAction] = useFormState(LogOutAction, true);
    return (
        <form action={logOutAction}>
            <LogoutButton />
        </form>
    );
}

export function CopyToClipboardButton({ value }: { value: string }) {
    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.success('コピーしました!');
        } catch (err) {
            console.error(err);
            toast.error('コピーに失敗しました');
        }
    };

    return (
        <button
            onClick={() => copyToClipboard(value)}
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-1 px-2 rounded shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
            クリップボードにコピー
        </button>
    );
}
