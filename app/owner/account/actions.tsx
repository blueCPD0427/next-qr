'use server';

import { signIn,signOut } from "@/auth";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { OwnerAccountForm } from "@/app/lib/difinitions";

// ログイン認証
export async function authenticate(prevState: boolean, formData: FormData) {
    try {
        await signIn('credentials', formData);
        return true
    } catch (error) {
        // リダイレクトエラーの場合は補正してやる
        if (isRedirectError(error)) {
            redirect("/owner/menu");
        }
        if ((error as Error).message.includes('CredentialsSignin')) {
            return false
        }
        return false;
        // throw error
    }
}

export async function LogoutAction() {
    try {
        await signOut({ redirectTo: "/" })
        return true
    } catch (error) {
        throw error
    }
}

// オーナーアカウントスキーマ
const OwnerAccountSchema = z.object({
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
const CreateOwnerAccount = OwnerAccountSchema.omit({id: true});

// omitを使用する場合、refineを使えないため、ここで改めてrefineを使用した状態のオブジェクトを用意する
const CreateOwnerAccountRefined =
    CreateOwnerAccount
    .refine(
        (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
            message: "パスワードと確認パスワードの内容が異なっています。",
            path:["confirmPassword"]
        }
    )
    .superRefine(
        async (data, ctx) => {
            const duplicateEmail = await prisma.owners.findFirst({
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

export type OwnerAccountValidateState = {
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

export type OwnerAccountValidateStateInside = {
    _errors?: string[];
    name?: {_errors?: string[]};
    email?: {_errors?: string[]};
    password?: {_errors?: string[]};
    confirmPassword?: {_errors?: string[]};
    postCode?: {_errors?: string[]};
    address?: {_errors?: string[]};
}

export async function createOwnerAccountApi(formData: OwnerAccountForm){

    try{
        const validatedFields = await CreateOwnerAccountRefined.parseAsync({
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

            await prisma.owners.create({
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
         * オーナーアカウントの作成に成功したら、
         * 「OwnersCustomConfigurations」テーブルにデフォルトの設定を作成しておく
         * デフォルトは設定名「ポイント」、制約タイプは「int」
         */

    } catch(error){
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };

    // revalidatePath('/owner/account/create');
    // redirect('/owner/login');

}

export async function getEditOwnerData(ownerId:string)
{
    try{
        const ownerData = await prisma.owners.findFirst({
            where:{
                id: ownerId
            },
            select:{
                id:true,
                name:true,
                email:true,
                postCode:true,
                address:true,
            }
        })

        return ownerData;
    }catch(error){
        console.error(error);
        return {};
    }
}

export async function updateOwnerAccountApi(formData: OwnerAccountForm){

    // パスワードの入力があればバリデーションにパスワードの項目を追加する
    let existPassword = true;
    let UpdateOwnerAccountRefined = null;
    if(formData.password != ''){
        UpdateOwnerAccountRefined = OwnerAccountSchema
        .refine(
            (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
                message: "パスワードと確認パスワードの内容が異なっています。",
                path:["confirmPassword"]
            }
        )
        .superRefine(
            async (data, ctx) => {
                const duplicateEmail = await prisma.owners.findFirst({
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
        const OmitPasswordSchema = OwnerAccountSchema.omit({password: true,confirmPassword: true});

        UpdateOwnerAccountRefined = OmitPasswordSchema
        .superRefine(
            async (data, ctx) => {
                const duplicateEmail = await prisma.owners.findFirst({
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
        const validatedFields = await UpdateOwnerAccountRefined.parseAsync({
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

                await prisma.owners.update({
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
                await prisma.owners.update({
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
         * オーナーアカウントの作成に成功したら、
         * 「OwnersCustomConfigurations」テーブルにデフォルトの設定を作成しておく
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