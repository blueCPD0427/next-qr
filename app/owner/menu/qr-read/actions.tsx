'use server';

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";

export async function getOwnersCustomConfigurations(ownerId:string){
    const oCClist = await prisma.ownersCustomConfigurations.findMany({
        where : {
            ownerId: ownerId,
        }
    })

    return oCClist;
}

export async function getOwnerToCustomerRelations(ownerId:string, customerId:string){
    const relationData = await prisma.ownerToCustomerRelations.findFirst({
        where:{
            ownerId: ownerId,
            customerId: customerId
        },
        select:{
            customer:{
                select:{
                    lastName: true,
                    firstName: true,
                    confCustomerData:true
                }
            }
        }
    });

    return relationData;
}
