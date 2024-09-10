import Link from 'next/link';
import Image from 'next/image';
import { Dela_Gothic_One } from 'next/font/google';

const dela = Dela_Gothic_One({
    subsets: ['latin'],
    weight: '400',
});

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div>
                <div
                    className={`${dela.className} text-7xl text-center w-full`}
                >
                    QR君!!
                </div>
                <Image
                    src="/img/qr-boy.jpg"
                    alt="qr君"
                    width={500}
                    height={500}
                    className="rounded-lg"
                    priority
                />
                <div className="flex justify-evenly w-full rounded-lg py-3">
                    <Link
                        href="/master/login"
                        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-orange-700 hover:shadow-inner transition duration-200"
                    >
                        マスターズサイト
                    </Link>
                    <Link
                        href="/member/login"
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-inner transition duration-200"
                    >
                        メンバーサイト
                    </Link>
                </div>
            </div>
        </div>
    );
}
