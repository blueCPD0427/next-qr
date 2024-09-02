import { OwnerAccountForm } from "@/app/lib/difinitions";
import { updateOwnerAccountApi } from "@/app/owner/account/actions";

export async function POST(request:Request) {

    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:OwnerAccountForm) {

    // ここに非同期処理を記述
    const res = await updateOwnerAccountApi(body);

    return res;
}