'use server';
import { MemberConnectForm,ToggleDispData } from "@/app/lib/difinitions";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { existMaster,existMember } from "@/app/lib/actions/action";

// 連携スキーマ
const ConnectMemberToMasterSchema = z.object({
    addressDisp: z.enum(['true','false'],{message: "登録できない値が入力されています。"}),
    birthdayDisp: z.enum(['true','false'],{message: "登録できない値が入力されています。"}),
    masterId: z.string().min(1,{message: "送信されたパラメータが不正です。"}),
}).superRefine(
    async (data, ctx) => {
        const existMasterRes = await existMaster(data.masterId)

        if(!existMasterRes){
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


export default async function toggleDisp(formData:ToggleDispData){
    try{
        const ToggleDispSchema = z.object({
            masterId: z.string().min(1,{message: "システムエラーが発生しました。"}),
            memberId: z.string().min(1,{message: "システムエラーが発生しました。"}),
            target: z.enum(['addressDisp','birthdayDisp'],{message: "登録できない値が入力されています。"}),
        }).superRefine(
            async (data, ctx) => {
                const existMasterRes = await existMaster(data.masterId)

                if(!existMasterRes){
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "送信されたパラメータが不正です。",
                        path:["masterId"]
                    })
                }
            }
        ).superRefine(
            async (data, ctx) => {
                const existMemberRes = await existMember(data.memberId)

                if(!existMemberRes){
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "送信されたパラメータが不正です。",
                        path:["memberId"]
                    })
                }
            }
        );


        const validatedFields = await ToggleDispSchema.parseAsync({
            masterId: formData.masterId,
            memberId: formData.memberId,
            target: formData.target,
        });

        const { masterId, memberId, target } = validatedFields;

        const existRelationRes = await prisma.masterToMemberRelations.findFirst({
            where:{
                masterId:masterId,
                memberId:memberId,
            },
            select:{
                [target]:true
            }
        })

        if(!existRelationRes){
            return {
                success: false,
                message: '連携情報が存在しません。',
            }
        }

        const toggleParam = existRelationRes[target] === true ? false : true;

        try{

            await prisma.masterToMemberRelations.update({
                where:{
                    masterId_memberId:{
                        masterId: masterId,
                        memberId: memberId
                    }
                },
                data:{
                    [target]: toggleParam
                }
            })
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: '連携情報の登録に失敗しました。',
            }
        }

        console.log('api success!!!!!');
        return { success: true };

    } catch(error){
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }



}