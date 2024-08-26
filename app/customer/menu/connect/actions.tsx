'use server';
import { CustomerConnectForm } from "@/app/lib/difinitions";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";

// 連携スキーマ
const ConnectCustomerToOwnerSchema = z.object({
    addressDisp: z.enum(['true','false'],{message: "登録できない値が入力されています。"}),
    birthdayDisp: z.enum(['true','false'],{message: "登録できない値が入力されています。"}),
    ownerId: z.string().min(1,{message: "送信されたパラメータが不正です。"}),
}).superRefine(
    async (data, ctx) => {
        const existOwner = await prisma.owners.findFirst({
            where:{
                id: data.ownerId
            }
        })

        if(!existOwner){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "送信されたパラメータが不正です。",
                path:["ownerId"]
            })
        }
    }
);

export type CustomerConnectValidateState = {
    success?: boolean;
    message?: string;
    errors?: CustomerConnectValidateStateInside;
}

export type CustomerConnectValidateStateInside = {
    _errors?: string[];
    addressDisp?: {_errors?: string[]};
    birthdayDisp?: {_errors?: string[]};
    ownerId?: {_errors?: string[]};
}

export async function connectCustomerToOwner(formData:CustomerConnectForm){

    console.log(formData.ownerId);

    try{
        const validatedFields = await ConnectCustomerToOwnerSchema.parseAsync({
            addressDisp: formData.addressDisp,
            birthdayDisp: formData.birthdayDisp,
            ownerId: formData.ownerId,
        });

        const { addressDisp, birthdayDisp, ownerId } = validatedFields;

        const session = await auth();
        let customerId = "";

        if(session?.user?.id != undefined){
            customerId = session.user.id;
        }else{
            return {
                success: false,
                message: '連携情報の登録に失敗しました。',
            }
        }

        const addressDispBoolean = addressDisp === 'true' ? true : false;
        const birthdayDispBoolean = birthdayDisp === 'true' ? true : false;

        try{

            await prisma.ownertoCustomerRelations.create({
                data:{
                    ownerId: ownerId,
                    customerId: customerId,
                    addressDisp: addressDispBoolean,
                    birthdayDisp: birthdayDispBoolean,
                }
            })
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: '連携情報の登録に失敗しました。',
            }
        }
    } catch(error){
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };
}