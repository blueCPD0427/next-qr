'use server';

import { auth } from "@/auth";
import {z} from 'zod';
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

export async function setCustomForm(prevState:any, formData: FormData) {

    // なんとかして画面からcustomerIdを取得する

    const session = await auth();

    // ここで送信される想定のform名を全部取得
    const oCClist = await prisma.ownersCustomConfigurations.findMany({
        where : {
            ownerId: session?.user?.id
        },
        select : {
            id: true,
            ownerId: true,
            configurationTitle: true,
            configurationConstraint: true,
        },
    })

    type ValidationTarget = {
        [key: string]: FormDataEntryValue | null;
    };

    let validationTarget:ValidationTarget = {};
    const CustomFormSchema = z.object({});
    oCClist.map((oCC) => {
        const customName = oCC.id;

        if(oCC?.configurationConstraint == undefined){
            return false;
        }

        const customType = oCC?.configurationConstraint;

        const formName = customName+'_'+customType;


        // 各タイプのバリデーション設定
        switch(true){
            case(oCC.configurationConstraint == 'text'):
                CustomFormSchema.extend({
                    [formName]: z.string().min(1,'値が空です')
                })
                break;
            // case(oCC.configurationConstraint == 'int'):
            //     CustomFormSchema.extend({
            //         [customName+'_int']: z.string().min(1,'値が空です')
            //     })
            //     break;
            // case(oCC.configurationConstraint == 'boolean'):
            //     CustomFormSchema.extend({
            //         [customName+'_bool']: z.string().min(1,'値が空です')
            //     })
            //     break;
            default:
                return false;
                break;
        }

        validationTarget = {
            ...validationTarget,
            [formName]: formData.get(formName),
        }
    })

    // 一件もフォームが無かったらエラー
    if(!validationTarget){
        return false;
    }


    const validatedFields = CustomFormSchema.safeParse({
        validationTarget
    });

    oCClist.map((oCC) => {
        const formName = oCC.id + '_' + oCC.configurationConstraint;
        console.log(validationTarget?.[formName]);

        // ここで各フォームの内容を入れる



    })


    // if (!validatedFields.success) {
    //     return { errors: validatedFields.error.format() };
    // }

    // データの処理ロジック
}
