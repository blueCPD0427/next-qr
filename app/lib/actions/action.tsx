'use server';

import { z } from 'zod';
import prisma from '../prisma';

// ここのバリデーションメッセージを取り出す方法を探す
const FormSchema = z.object({
    postCode: z.coerce.string().length(7,{message: '郵便番号は7文字で入力!!'}),
})

export async function getAddressFromPostCode(postCode: string){

    const validatedFields = FormSchema.safeParse({
        postCode: postCode,
    });

    if(validatedFields.success === true){
        const res = await fetch(
            `https://jp-postal-code-api.ttskch.com/api/v1/${postCode}.json`
        );

        if(res.status !== 200){
            return false;
        }

        const data = await res.json();

        return data;
    }else{
        return false;
    }

}

export async function existOwner(ownerId:string){
    try{
        const existOwner = await prisma.owners.findFirst({
            where:{
                id: ownerId
            }
        })

        if(!existOwner){
            return false;
        }else{
            return true;
        }
    }catch(error){
        return true;
    }
}