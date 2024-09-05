'use server';
import prisma from "@/app/lib/prisma";
import ConnectForm from "@/app/member/menu/connect/connect-form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function ConnectedAccount(masterId:string) {
    const session = await auth();

    if(session?.user?.id == undefined){
        redirect('/member/menu/error?type=dis-account');
        return false;
    }

    const ConnectedData = await prisma.masterToMemberRelations.findMany({
        where: {
            AND:[
                {masterId: {contains: masterId}},
                {memberId: {contains: session.user.id}},
            ]
        }
    })

    if(ConnectedData.length > 0){
        return true;
    }else{
        return false;
    }
}

export default async function MemberConnectPage({ searchParams }: { searchParams: { master: string } }){
    const masterId = searchParams.master;
    const masterData = await prisma.masters.findFirst({
        where: {id: masterId},
        select: {
            id:true,
            name: true,
            email: true,
            postCode: true,
            address: true,
        }
    })

    if(!masterData){
        redirect('/member/menu/error?type=master-connect');
    }

    // 既に連携済みだったら弾く
    const connected = await ConnectedAccount(masterId);
    if(connected === true){
        redirect('/member/menu/error?type=already-connect');
    }

    return (
        <div>
            <ConnectForm masterData={masterData} />
        </div>
    )

}