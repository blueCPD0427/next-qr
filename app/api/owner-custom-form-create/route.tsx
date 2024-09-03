import { OwnerCustomForm } from "@/app/lib/difinitions";
import { createOwnerCustomFormApi } from "@/app/owner/menu/setting/form/actions";

export async function POST(request:Request) {

    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:OwnerCustomForm) {

    // ここに非同期処理を記述
    const res = await createOwnerCustomFormApi(body);

    return res;
}