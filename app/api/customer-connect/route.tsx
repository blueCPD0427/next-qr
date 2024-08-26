import { CustomerConnectForm } from "@/app/lib/difinitions";
import { connectCustomerToOwner } from "@/app/customer/menu/connect/actions";

export async function POST(request:Request) {

    const body = await request.json();

    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:CustomerConnectForm) {


    // ここに非同期処理を記述
    const res = await connectCustomerToOwner(body);

    return res;
}