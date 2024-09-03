'use server';
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { OwnerCustomForm } from "@/app/lib/difinitions";
import { existOwner } from "@/app/lib/actions/action";

const OwnerCustomFormSchema = z.object({
    ownerId: z.string()
                .min(1,{message: "システムエラーが発生しました。"})
                .superRefine(
                    async (data, ctx) => {
                        const existOwnerRes = await existOwner(data.ownerId)

                        if(!existOwnerRes){
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: "送信されたパラメータが不正です。",
                                path:["ownerId"]
                            })
                        }
                    }
                ),
    configurationTitle: z.string()
                            .min(1,{message: "データ名は必須です。"}),
    configurationConstraint: z.enum(['text','int','boolean'],{message: "データの形式が正しくありません。"})
})

export async function createOwnerCustomFormApi(formData:OwnerCustomForm){
    try{
        const validatedFields = await OwnerCustomFormSchema.parseAsync({
            ownerId: formData.ownerId,
            configurationTitle: formData.configurationTitle,
            configurationConstraint: formData.configurationConstraint,
        });

        const { ownerId, configurationTitle, configurationConstraint } = validatedFields;

        try{

            await prisma.ownersCustomConfigurations.create({
                data:{
                    ownerId: ownerId,
                    configurationTitle: configurationTitle,
                    configurationConstraint: configurationConstraint,
                }
            })
        }catch(error){
            console.error(error);
            return {
                success: false,
                message: 'データ項目の登録に失敗しました。',
            }
        }

    } catch(error){
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };
}