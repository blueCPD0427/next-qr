import { MasterAccountForm } from "@/app/lib/difinitions";
import { createMasterAccountApi } from "@/app/master/account/actions";

export async function POST(request:Request) {

    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:MasterAccountForm) {

    // ここに非同期処理を記述
    const res = await createMasterAccountApi(body);

    return res;
}