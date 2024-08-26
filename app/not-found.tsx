import type { Metadata } from 'next'

export const metadata:Metadata = {
    title: '404'
}

export default function Page() {
    const errorMessage = 'お探しのページは見つかりませんでした。';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">
                404 - Page Not Found
            </h1>
            <p className="mt-4 text-lg text-gray-700">
                {errorMessage}
            </p>
            <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                ホームに戻る
            </a>
        </div>
    );
}