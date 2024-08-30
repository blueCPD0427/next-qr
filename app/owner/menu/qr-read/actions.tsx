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

type ValidationTarget = {
    [key: string]: FormDataEntryValue | null;
};

export async function setCustomForm(prevState, formData: FormData) {

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

    let validationTarget:ValidationTarget = {
        customerId: formData.get('customerId')
    };

    let CustomFormSchema = z.object({
        customerId: z.string().min(1,{message:'送信されたパラメータに異常があります'})
    });

    // ここのタイプエラーをなんとかしたい
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
                CustomFormSchema = CustomFormSchema.extend({
                    [formName]: z.string().min(1,{message:'値が空です'})
                })
                break;
            case(oCC.configurationConstraint == 'int'):
                CustomFormSchema = CustomFormSchema.extend({
                    [customName+'_int']: z.string().min(1,{message:'値が空です'})
                })
                break;
            case(oCC.configurationConstraint == 'boolean'):
                CustomFormSchema = CustomFormSchema.extend({
                    [customName+'_bool']: z.string().min(1,{message:'値が空です'})
                })
                break;
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
        return {
            success: false,
            message: 'システムエラー[フォームが存在しません]',
        };
    }

    // console.log(CustomFormSchema);
    console.log(validationTarget);

    const validatedFields = CustomFormSchema.safeParse({
        ...validationTarget
    });

    console.log(validatedFields);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: '入力内容を再確認してください。',
        };
    }

    const customerId = formData.get('customerId');
    if(typeof customerId !== 'string'){
        return false;
    }

    oCClist.map(async (oCC) => {
        const formName = oCC.id + '_' + oCC.configurationConstraint;
        console.log(validationTarget?.[formName]);
        let inputCustomData = validationTarget?.[formName];
        if(typeof inputCustomData !== 'string'){
            inputCustomData = '';
        }

        // ここで各フォームの内容を入れる
        const existCustomerData = await prisma.configurationsCustomerData.count({
            where:{
                oCCId: oCC.id,
                customerId: customerId
            }
        })

        // 存在する場合はUPDATE、無ければcreate
        if(existCustomerData > 0){
            const updateCustomerData = await prisma.configurationsCustomerData.update({
                where:{
                    oCCId_customerId:{
                        oCCId: oCC.id,
                        customerId: customerId
                    }
                },
                data:{
                    configurationData: inputCustomData
                }
            })

            console.log(updateCustomerData);

            return {
                success: true,
                message: '更新に成功しました。',
            };
        }else{
            const createCustomerData = await prisma.configurationsCustomerData.create({
                data:{
                    oCCId: oCC.id,
                    customerId: customerId,
                    configurationData: inputCustomData
                }
            })

            console.log(createCustomerData);

            return {
                success: true,
                message: '登録に成功しました。',
            };
        }

    })

    // 全部やって問題なかったら戻す
    return {
        success: false,
        message: '異常が発生しました。',
    };
}
