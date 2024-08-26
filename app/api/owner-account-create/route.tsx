import { OwnerAccountCreateForm } from "@/app/lib/difinitions";
import { createOwnerAccountApi } from "@/app/owner/account/actions";

export async function POST(request:Request) {

    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:OwnerAccountCreateForm) {

    // ここに非同期処理を記述
    const res = await createOwnerAccountApi(body);

    return res;
}