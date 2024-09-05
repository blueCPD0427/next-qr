import { ToggleDispData } from "@/app/lib/difinitions";
import toggleDisp from "@/app/member/menu/connect/actions";

export async function POST(request:Request) {

    const body = await request.json();

    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:ToggleDispData) {


    // ここに非同期処理を記述
    const res = await toggleDisp(body);

    return res;
}