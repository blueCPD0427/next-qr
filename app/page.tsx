import Link from "next/link";

export default function Home() {
    return (
        <div>
            <div>
                オーナーズサイトは
                <Link href="/owner/login">
                こちら
                </Link>
            </div>
            <div>
                一般の方は
                <Link href="/customer/login">
                こちら
                </Link>
            </div>
        </div>
    );
}
