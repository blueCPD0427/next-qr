import { MemberAccountForm } from "@/app/lib/difinitions";
import { updateMemberAccountApi } from "@/app/member/account/actions";

export async function POST(request:Request) {

    const body = await request.json();
    const data = await processData(body);

    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

async function processData(body:MemberAccountForm) {

    // ここに非同期処理を記述
    const res = await updateMemberAccountApi(body);

    return res;
}