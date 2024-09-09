'use server';
import { signIn,signOut } from "@/auth";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import bcrypt from 'bcrypt';
import { MemberAccountForm } from "@/app/lib/difinitions";
import { lPadNum } from "@/app/lib/actions/convert";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

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
const MemberAccountSchema = z.object({
    id: z.string(),
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

// Createの際は「id」の検証は不要なので、ここで一旦除外
const CreateMemberAccount = MemberAccountSchema.omit({id: true});

// omitを使用する場合、refineを使えないため、ここで改めてrefineを使用した状態のオブジェクトを用意する
const CreateMemberAccountRefined =
    CreateMemberAccount
    .refine(
        (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
            message: "パスワードと確認パスワードの内容が異なっています。",
            path:["confirmPassword"]
        }
    )
    .superRefine(
        async (data, ctx) => {
            const duplicateEmail = await prisma.members.findFirst({
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

export type MemberAccountValidateState = {
    success?: boolean;
    message?: string;
    errors?: MemberAccountValidateStateInside;
}

export type MemberAccountValidateStateInside = {
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

export async function createMemberAccountApi(formData: MemberAccountForm){

    try{
        const validatedFields = await CreateMemberAccountRefined.parseAsync({
            lastName: formData.lastName,
            firstName: formData.firstName,
            sex: (formData.sex != undefined ? formData.sex : null),
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

            await prisma.members.create({
                data:{
                    lastName: lastName,
                    firstName: firstName,
                    sex: (sex === '' ? null : sex),
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

    // revalidatePath('/member/account/create');
    // redirect('/member/login');

}

export async function getEditMemberData(memberId:string)
{
    try{
        const memberData = await prisma.members.findFirst({
            where:{
                id: memberId
            },
            select:{
                id:true,
                lastName:true,
                firstName:true,
                sex:true,
                email:true,
                postCode:true,
                address:true,
                birthday:true,
            }
        })

        if(memberData == null){
            return {};
        }

        const convertBirthday = new Date(memberData.birthday);

        const returnData = {
            id:memberData.id,
            lastName:memberData.lastName,
            firstName:memberData.firstName,
            sex:memberData.sex,
            email:memberData.email,
            postCode:memberData.postCode,
            address:memberData.address,
            birthdayY:convertBirthday.getFullYear(),
            birthdayM:convertBirthday.getMonth() + 1,
            birthdayD:convertBirthday.getDate(),
        }

        return returnData;
    }catch(error){
        console.error(error);
        return {};
    }
}

export async function updateMemberAccountApi(formData: MemberAccountForm){

    // パスワードの入力があればバリデーションにパスワードの項目を追加する
    let existPassword = true;
    let UpdateMemberAccountRefined = null;

    if(formData.password != ''){
        UpdateMemberAccountRefined = MemberAccountSchema
        .refine(
            (data) => data.password != '' && data.confirmPassword != '' && data.password === data.confirmPassword, {
                message: "パスワードと確認パスワードの内容が異なっています。",
                path:["confirmPassword"]
            }
        )
        .superRefine(
            async (data, ctx) => {
                const duplicateEmail = await prisma.members.findFirst({
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
        const OmitPasswordSchema = MemberAccountSchema.omit({password: true,confirmPassword: true});

        UpdateMemberAccountRefined = OmitPasswordSchema
        .superRefine(
            async (data, ctx) => {
                const duplicateEmail = await prisma.members.findFirst({
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
        const validatedFields = await UpdateMemberAccountRefined.parseAsync({
            id: formData.id,
            lastName: formData.lastName,
            firstName: formData.firstName,
            sex: (formData.sex != undefined ? formData.sex : null),
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            postCode: String(formData.postCode),
            address: formData.address,
            birthday: formData.birthdayY+'-'+(lPadNum(formData.birthdayM, 2))+'-'+(lPadNum(formData.birthdayD, 2)),
        });

        const { lastName, firstName, sex, postCode, address, email, birthday } = validatedFields;

        const convertPostCode = Number(postCode);
        const convertBirthday = new Date(birthday+' 00:00:00');

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

                await prisma.members.update({
                    where:{
                        id: formData.id
                    },
                    data:{
                        lastName: lastName,
                        firstName: firstName,
                        sex: (sex === '' ? null : sex),
                        postCode: convertPostCode,
                        address: address,
                        email: email,
                        birthday: convertBirthday,
                        password: hashedPassword,
                    }
                })
            }else{
                await prisma.members.update({
                    where:{
                        id: formData.id
                    },
                    data:{
                        lastName: lastName,
                        firstName: firstName,
                        sex: (sex === '' ? null : sex),
                        postCode: convertPostCode,
                        address: address,
                        email: email,
                        birthday: convertBirthday,
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

    } catch(error){
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };

}
