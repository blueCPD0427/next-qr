'use server';

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";

export async function getOwnersCustomConfigurations(ownerId:string, customerId:string){
    const oCClist = await prisma.ownersCustomConfigurations.findMany({
        where : {
            ownerId: ownerId
        },
        select : {
            id: true,
            ownerId: true,
            configurationTitle: true,
            configurationConstraint: true,
            confCustomerData : {
                where:{
                    customerId: customerId
                },
                select:{
                    customerId: true,
                    configurationData: true,
                }
            }
        },
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
