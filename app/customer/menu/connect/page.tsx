'use server';
import prisma from "@/app/lib/prisma";
import ConnectForm from "@/app/customer/menu/connect/connect-form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function ConnectedAccount(ownerId:string) {
    const session = await auth();

    if(session?.user?.id == undefined){
        redirect('/customer/menu/error?type=dis-account');
        return false;
    }

    const ConnectedData = await prisma.ownerToCustomerRelations.findMany({
        where: {
            AND:[
                {ownerId: {contains: ownerId}},
                {customerId: {contains: session.user.id}},
            ]
        }
    })

    if(ConnectedData.length > 0){
        return true;
    }else{
        return false;
    }
}

export default async function CustomerConnectPage({ searchParams }: { searchParams: { owner: string } }){
    const ownerId = searchParams.owner;
    const ownerData = await prisma.owners.findFirst({
        where: {id: ownerId},
        select: {
            id:true,
            name: true,
            email: true,
            postCode: true,
            address: true,
        }
    })

    if(!ownerData){
        redirect('/customer/menu/error?type=owner-connect');
    }

    // 既に連携済みだったら弾く
    const connected = await ConnectedAccount(ownerId);
    if(connected === true){
        redirect('/customer/menu/error?type=already-connect');
    }

    return (
        <div>
            <ConnectForm ownerData={ownerData} />
        </div>
    )

}