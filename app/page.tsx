import Link from "next/link";

export default function Home() {
    return (
        <div>
            <div>
                マスターズサイトは
                <Link href="/master/login">
                こちら
                </Link>
            </div>
            <div>
                一般の方は
                <Link href="/member/login">
                こちら
                </Link>
            </div>
        </div>
    );
}
