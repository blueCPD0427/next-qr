'use server';
import { MemberConnectForm } from "@/app/lib/difinitions";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";

// 連携スキーマ
const ConnectMemberToMasterSchema = z.object({
    addressDisp: z.enum(['true','false'],{message: "登録できない値が入力されています。"}),
    birthdayDisp: z.enum(['true','false'],{message: "登録できない値が入力されています。"}),
    masterId: z.string().min(1,{message: "送信されたパラメータが不正です。"}),
}).superRefine(
    async (data, ctx) => {
        const existMaster = await prisma.masters.findFirst({
            where:{
                id: data.masterId
            }
        })

        if(!existMaster){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "送信されたパラメータが不正です。",
                path:["masterId"]
            })
        }
    }
);

export type MemberConnectValidateState = {
    success?: boolean;
    message?: string;
    errors?: MemberConnectValidateStateInside;
}

export type MemberConnectValidateStateInside = {
    _errors?: string[];
    addressDisp?: {_errors?: string[]};
    birthdayDisp?: {_errors?: string[]};
    masterId?: {_errors?: string[]};
}

export async function connectMemberToMaster(formData:MemberConnectForm){

    console.log(formData.masterId);

    try{
        const validatedFields = await ConnectMemberToMasterSchema.parseAsync({
            addressDisp: formData.addressDisp,
            birthdayDisp: formData.birthdayDisp,
            masterId: formData.masterId,
        });

        const { addressDisp, birthdayDisp, masterId } = validatedFields;

        const session = await auth();
        let memberId = "";

        if(session?.user?.id != undefined){
            memberId = session.user.id;
        }else{
            return {
                success: false,
                message: '連携情報の登録に失敗しました。',
            }
        }

        const addressDispBoolean = addressDisp === 'true' ? true : false;
        const birthdayDispBoolean = birthdayDisp === 'true' ? true : false;

        try{

            await prisma.masterToMemberRelations.create({
                data:{
                    masterId: masterId,
                    memberId: memberId,
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