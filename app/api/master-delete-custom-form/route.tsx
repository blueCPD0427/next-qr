import { DeleteMasterCustomForm } from '@/app/lib/difinitions';
import { deleteMasterCustomFormApi } from '@/app/master/menu/setting/form/actions';

export async function POST(request: Request) {
    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body: DeleteMasterCustomForm) {
    // ここに非同期処理を記述
    const res = await deleteMasterCustomFormApi(body);

    return res;
}
