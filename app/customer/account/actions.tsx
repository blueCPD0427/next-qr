'use server';
import { signIn,signOut } from "@/auth";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import bcrypt from 'bcrypt';
import { CustomerAccountCreateForm } from "@/app/lib/difinitions";
import { lPadNum } from "@/app/lib/actions/convert";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

// ログイン認証
export async function authenticate(prevState: boolean, formData: FormData) {
    try {
        const formDataObj = Object.fromEntries(formData.entries());
        await signIn('credentials', formData);

        return true
    } catch (error) {
        // リダイレクトエラーの場合は補正してやる
        if (isRedirectError(error)) {
            redirect("/customer/menu");
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
const CustomerAccountSchema = z.object({
    userId: z.number(),
    lastName: z.string()
            .min(1,{message: "名前（姓）の入力は必須です。"}),
    firstName: z.string()
            .min(1,{message: "名前（名）の入力は必須です。"}),
    sex: z.enum(['male','female',''],{message: "登録できない値が入力されています。"}),
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
    birthday: z.string()
                    .min(1,{message: "生年月日の入力は必須です。"})
                    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,{message: "生年月日の形式に誤りがあります。"}),
})

// Createの際は「userId」の検証は不要なので、ここで一旦除外
const CreateCustomerAccount = CustomerAccountSchema.omit({userId: true});

// omitを使用する場合、refineを使えないため、ここで改めてrefineを使用した状態のオブジェクトを用意する
const CreateCustomerAccountRefined =
    CreateCustomerAccount
    .refine(
        (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
            message: "パスワードと確認パスワードの内容が異なっています。",
            path:["confirmPassword"]
        }
    )
    .superRefine(
        async (data, ctx) => {
            const duplicateEmail = await prisma.customers.findFirst({
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

export type CustomerAccountValidateState = {
    success?: boolean;
    message?: string;
    errors?: CustomerAccountValidateStateInside;
}

export type CustomerAccountValidateStateInside = {
    _errors?: string[];
    lastName?: {_errors?: string[]};
    firstName?: {_errors?: string[]};
    sex?: {_errors?: string[]};
    email?: {_errors?: string[]};
    password?: {_errors?: string[]};
    confirmPassword?: {_errors?: string[]};
    postCode?: {_errors?: string[]};
    address?: {_errors?: string[]};
    birthday?: {_errors?: string[]};
}

export async function createCustomerAccountApi(formData: CustomerAccountCreateForm){

    try{
        const validatedFields = await CreateCustomerAccountRefined.parseAsync({
            lastName: formData.lastName,
            firstName: formData.firstName,
            sex: formData.sex,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            postCode: formData.postCode,
            address: formData.address,
            birthday: formData.birthdayY+'-'+(lPadNum(formData.birthdayM, 2))+'-'+(lPadNum(formData.birthdayD, 2)),
        });

        const { lastName, firstName, sex, postCode, address, email, password, birthday } = validatedFields;

        const hashedPassword = await bcrypt.hash(password, 10);
        const convertPostCode = Number(postCode);
        const convertBirthday = new Date(birthday+' 00:00:00');

        try{

            await prisma.customers.create({
                data:{
                    lastName: lastName,
                    firstName: firstName,
                    sex: sex,
                    postCode: convertPostCode,
                    address: address,
                    email: email,
                    password: hashedPassword,
                    birthday: convertBirthday,
                }
            })
        }catch(error){
            console.log(error);
            return {
                success: false,
                message: 'アカウントの新規作成に失敗しました。',
            }
        }

    } catch(error){
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };

    // revalidatePath('/customer/account/create');
    // redirect('/customer/login');

}

export async function updateCustomerAccount(formData: CustomerAccountCreateForm){

    // try{
    //     const validatedFields = await CreateCustomerAccountRefined.parseAsync({
    //         lastName: formData.lastName,
    //         firstName: formData.firstName,
    //         sex: formData.sex,
    //         email: formData.email,
    //         password: formData.password,
    //         confirmPassword: formData.confirmPassword,
    //         postCode: formData.postCode,
    //         address: formData.address,
    //         birthday: formData.birthdayY+'-'+(lPadNum(formData.birthdayM, 2))+'-'+(lPadNum(formData.birthdayD, 2)),
    //     });

    //     const { lastName, firstName, sex, postCode, address, email, password, birthday } = validatedFields;

    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const convertPostCode = Number(postCode);
    //     const convertBirthday = new Date(birthday+' 00:00:00');

    //     try{

    //         await prisma.customers.create({
    //             data:{
    //                 lastName: lastName,
    //                 firstName: firstName,
    //                 sex: sex,
    //                 postCode: convertPostCode,
    //                 address: address,
    //                 email: email,
    //                 password: hashedPassword,
    //                 birthday: convertBirthday,
    //             }
    //         })
    //     }catch(error){
    //         console.log(error);
    //         return {
    //             success: false,
    //             message: 'アカウントの新規作成に失敗しました。',
    //         }
    //     }

    // } catch(error){
    //     if (error instanceof z.ZodError) {
    //         return { success: false, errors: error.format() };
    //     }
    // }

    // console.log('api success!!!!!');
    // return { success: true };

    // revalidatePath('/customer/account/create');
    // redirect('/customer/login');

}
