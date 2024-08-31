'use client';

import { useEffect } from 'react';
import type { Metadata } from 'next';

export const metadata:Metadata = {
    title: 'ERROR'
}

export default function Error({ error }: { error: Error & { digest?: string, cause?: string }; }) {
    useEffect(() => {
        // エラーをログに記録する
        console.error(error);
    }, [error]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">
                エラー
            </h1>
            <p className="mt-4 text-lg text-gray-700">
                {error.message}
            </p>
            <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                ホームに戻る
            </a>
        </div>
    );
}