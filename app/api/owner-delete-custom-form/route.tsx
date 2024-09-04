import { DeleteOwnerCustomForm } from "@/app/lib/difinitions";
import { deleteOwnerCustomFormApi } from "@/app/owner/menu/setting/form/actions";

export async function POST(request:Request) {

    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:DeleteOwnerCustomForm) {

    // ここに非同期処理を記述
    const res = await deleteOwnerCustomFormApi(body);

    return res;
}