'use client';

export default function ErrorDisplay({
    errorMessage,
}: {
    errorMessage?: JSX.Element;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-red-600">エラー</h1>
            <p className="mt-4 text-lg text-gray-700">{errorMessage}</p>
            <a
                href="/"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                ホームに戻る
            </a>
        </div>
    );
}
