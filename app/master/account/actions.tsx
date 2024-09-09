'use server';

import { signIn,signOut } from "@/auth";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { MasterAccountForm } from "@/app/lib/difinitions";

// ログイン認証
export async function authenticate(prevState: boolean, formData: FormData) {
    // try catch内でredirectを行うとcatchされてしまうので、外でredirectする
    let redirectPath = null;
    try {
        const formDataObj = Object.fromEntries(formData.entries());
        const signInRes = await signIn('credentials', {
            redirect: false,
            ...formDataObj,
        });

        redirectPath = signInRes;

    } catch (error) {
        if ((error as Error).message.includes('CredentialsSignin')) {
            return false
        }

        return false;
    }

    redirect(redirectPath);
}

export async function LogoutAction() {
    try {
        await signOut({ redirectTo: "/" })
        return true
    } catch (error) {
        throw error
    }
}

// マスターアカウントスキーマ
const MasterAccountSchema = z.object({
    id: z.string()
            .min(1,{message: "システムエラーが発生しました。"}),
    name: z.string()
            .min(1,{message: "名前の入力は必須です。"}),
    postCode: z.string()
            .min(7,{message: "郵便番号の入力は必須です。"})
            .max(7,{message: "郵便番号の入力は必須です。"})
            .regex(/^[0-9]+$/,{message: "郵便番号は半角数字のみで入力してください。"}),
    address: z.string()
            .min(1,{message: "住所の入力は必須です。"}),
    email: z.string()
            .email({message: "メールアドレスの形式に誤りがあります。"})
            .min(1,{message: "メールアドレスの入力は必須です。"}),
    password: z.string()
                .min(1,{message: "パスワードの入力は必須です。"})
                .max(100,{message: "パスワードは100文字以内で入力して下さい。"}),
    confirmPassword: z.string()
                    .min(1,{message: "確認パスワードの入力は必須です。"})
                    .max(100,{message: "確認パスワードは100文字以内で入力して下さい。"}),
})

// Createの際は「id」の検証は不要なので、ここで一旦除外
const CreateMasterAccount = MasterAccountSchema.omit({id: true});

// omitを使用する場合、refineを使えないため、ここで改めてrefineを使用した状態のオブジェクトを用意する
const CreateMasterAccountRefined =
    CreateMasterAccount
    .refine(
        (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
            message: "パスワードと確認パスワードの内容が異なっています。",
            path:["confirmPassword"]
        }
    )
    .superRefine(
        async (data, ctx) => {
            const duplicateEmail = await prisma.masters.findFirst({
                where:{
                    email: data.email
                }
            })

            if(duplicateEmail){
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "メールアドレスを再確認してください。",
                    path:["email"]
                })
            }
        }
    );

export type MasterAccountValidateState = {
    success?: boolean;
    message?: string;
    errors?: {
        _errors?: string[];
        name?: {_errors?: string[]};
        email?: {_errors?: string[]};
        password?: {_errors?: string[]};
        confirmPassword?: {_errors?: string[]};
        postCode?: {_errors?: string[]};
        address?: {_errors?: string[]};
    };
}

export type MasterAccountValidateStateInside = {
    _errors?: string[];
    name?: {_errors?: string[]};
    email?: {_errors?: string[]};
    password?: {_errors?: string[]};
    confirmPassword?: {_errors?: string[]};
    postCode?: {_errors?: string[]};
    address?: {_errors?: string[]};
}

export async function createMasterAccountApi(formData: MasterAccountForm){

    try{
        const validatedFields = await CreateMasterAccountRefined.parseAsync({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            postCode: formData.postCode,
            address: formData.address,
        });

        const { name, postCode, address, email, password } = validatedFields;

        const hashedPassword = await bcrypt.hash(password, 10);
        const convertPostCode = Number(postCode);

        try{

            await prisma.masters.create({
                data:{
                    name: name,
                    postCode: convertPostCode,
                    address: address,
                    email: email,
                    password: hashedPassword,
                }
            })
        }catch(error){
            return {
                success: false,
                message: 'アカウントの新規作成に失敗しました。',
            }
        }

        /**
         * マスターアカウントの作成に成功したら、
         * 「MastersCustomConfigurations」テーブルにデフォルトの設定を作成しておく
         * デフォルトは設定名「ポイント」、制約タイプは「int」
         */

    } catch(error){
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };

    // revalidatePath('/master/account/create');
    // redirect('/master/login');

}

export async function getEditMasterData(masterId:string)
{
    try{
        const masterData = await prisma.masters.findFirst({
            where:{
                id: masterId
            },
            select:{
                id:true,
                name:true,
                email:true,
                postCode:true,
                address:true,
            }
        })

        return masterData;
    }catch(error){
        console.error(error);
        return {};
    }
}

export async function updateMasterAccountApi(formData: MasterAccountForm){

    // パスワードの入力があればバリデーションにパスワードの項目を追加する
    let existPassword = true;
    let UpdateMasterAccountRefined = null;
    if(formData.password != ''){
        UpdateMasterAccountRefined = MasterAccountSchema
        .refine(
            (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
                message: "パスワードと確認パスワードの内容が異なっています。",
                path:["confirmPassword"]
            }
        )
        .superRefine(
            async (data, ctx) => {
                const duplicateEmail = await prisma.masters.findFirst({
                    where:{
                        email: data.email,
                        id:{
                            not:data.id
                        }
                    }
                })

                if(duplicateEmail){
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "メールアドレスを再確認してください。",
                        path:["email"]
                    })
                }
            }
        );
    }else{
        // パスワードの入力が無いのでパスワードのバリデーションをオミット
        const OmitPasswordSchema = MasterAccountSchema.omit({password: true,confirmPassword: true});

        UpdateMasterAccountRefined = OmitPasswordSchema
        .superRefine(
            async (data, ctx) => {
                const duplicateEmail = await prisma.masters.findFirst({
                    where:{
                        email: data.email,
                        id:{
                            not:data.id
                        }
                    }
                })

                if(duplicateEmail){
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "メールアドレスを再確認してください。",
                        path:["email"]
                    })
                }
            }
        );

        // パスワードの入力フラグをOFF
        existPassword = false;
    }

    try{
        const validatedFields = await UpdateMasterAccountRefined.parseAsync({
            id: formData.id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            postCode: String(formData.postCode),
            address: formData.address,
        });

        const { name, postCode, address, email } = validatedFields;

        const convertPostCode = Number(postCode);

        try{

            if(existPassword === true){
                const password = formData.password != undefined ? formData.password : '';
                if(password == ''){
                    return {
                        success: false,
                        message: 'アカウントの更新に失敗しました。',
                    }
                }


                const hashedPassword = await bcrypt.hash(password, 10);

                await prisma.masters.update({
                    where:{
                        id: formData.id
                    },
                    data:{
                        name: name,
                        postCode: convertPostCode,
                        address: address,
                        email: email,
                        password: hashedPassword,
                    }
                })
            }else{
                await prisma.masters.update({
                    where:{
                        id: formData.id
                    },
                    data:{
                        name: name,
                        postCode: convertPostCode,
                        address: address,
                        email: email
                    }
                })
            }
        }catch(error){
            console.error(error);
            return {
                success: false,
                message: 'アカウントの更新に失敗しました。',
            }
        }

        /**
         * マスターアカウントの作成に成功したら、
         * 「MastersCustomConfigurations」テーブルにデフォルトの設定を作成しておく
         * デフォルトは設定名「ポイント」、制約タイプは「int」
         */

    } catch(error){
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };
}