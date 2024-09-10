'use server';

import { auth } from '@/auth';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';

export async function getMastersCustomConfigurations(
    masterId: string,
    memberId: string,
) {
    const mCClist = await prisma.mastersCustomConfigurations.findMany({
        where: {
            masterId: masterId,
        },
        select: {
            id: true,
            masterId: true,
            configurationTitle: true,
            configurationConstraint: true,
            confMemberData: {
                where: {
                    memberId: memberId,
                },
                select: {
                    memberId: true,
                    configurationData: true,
                },
            },
        },
    });

    return mCClist;
}

export async function getMasterToMemberRelations(
    masterId: string,
    memberId: string,
) {
    const relationData = await prisma.masterToMemberRelations.findFirst({
        where: {
            masterId: masterId,
            memberId: memberId,
        },
        select: {
            member: {
                select: {
                    lastName: true,
                    firstName: true,
                    confMemberData: true,
                },
            },
        },
    });

    return relationData;
}

type ValidationTarget = {
    [key: string]: FormDataEntryValue | null;
};

export async function setCustomForm(prevState: any, formData: FormData) {
    try {
        const session = await auth();

        // ここで送信される想定のform名を全部取得
        const mCClist = await prisma.mastersCustomConfigurations.findMany({
            where: {
                masterId: session?.user?.id,
            },
            select: {
                id: true,
                masterId: true,
                configurationTitle: true,
                configurationConstraint: true,
            },
        });

        let validationTarget: ValidationTarget = {
            memberId: formData.get('memberId'),
        };

        const CustomFormSchema = z.object({
            memberId: z
                .string()
                .min(1, { message: '送信されたパラメータに異常があります' }),
        });

        // ここのタイプエラーをなんとかしたい

        let addSchema = {};

        mCClist.map((mCC) => {
            const customName = mCC.id;

            if (mCC?.configurationConstraint == undefined) {
                return false;
            }

            const customType = mCC?.configurationConstraint;

            const formName = customName + '_' + customType;

            // booleanがチェックをつけていないとformDataに値が設定されないため、その対応措置
            let formInputData = null;

            // 各タイプのバリデーション設定
            switch (true) {
                case mCC.configurationConstraint == 'text':
                    addSchema = {
                        ...addSchema,
                        [formName]: z
                            .string()
                            .max(100, { message: '値は100文字までです' }),
                    };

                    formInputData = formData.get(formName);
                    break;
                case mCC.configurationConstraint == 'int':
                    addSchema = {
                        ...addSchema,
                        [formName]: z
                            .string()
                            .max(100, { message: '値は100文字までです' })
                            .regex(/^[0-9]*$/, {
                                message: '半角数字のみで入力してください。',
                            }),
                    };

                    formInputData = formData.get(formName);
                    break;
                case mCC.configurationConstraint == 'boolean':
                    addSchema = {
                        ...addSchema,
                        [formName]: z.enum(['true', ''], {
                            message: '値が不正です',
                        }),
                    };

                    if (formData.get(formName) == null) {
                        formInputData = '';
                    } else {
                        formInputData = formData.get(formName);
                    }

                    break;
                default:
                    return false;
                    break;
            }

            validationTarget = {
                ...validationTarget,
                [formName]: formInputData,
            };
        });

        // 一件もフォームが無かったらエラー
        if (!validationTarget) {
            return {
                success: false,
                message: 'システムエラー[フォームが存在しません]',
            };
        }

        const CustomFormSchemaExtend = CustomFormSchema.extend({
            ...addSchema,
        });

        const validatedFields = CustomFormSchemaExtend.safeParse({
            ...validationTarget,
        });

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: '入力内容を再確認してください。',
            };
        }

        const memberId = formData.get('memberId');
        if (typeof memberId !== 'string') {
            return false;
        }

        try {
            mCClist.map(async (mCC) => {
                const formName = mCC.id + '_' + mCC.configurationConstraint;
                let inputCustomData = validationTarget?.[formName];
                if (typeof inputCustomData !== 'string') {
                    inputCustomData = '';
                }

                // ここで各フォームの内容を入れる
                const existMemberData =
                    await prisma.configurationsMemberData.count({
                        where: {
                            mCCId: mCC.id,
                            memberId: memberId,
                        },
                    });

                // 存在する場合はUPDATE、無ければcreate
                if (existMemberData > 0) {
                    const updateMemberData =
                        await prisma.configurationsMemberData.update({
                            where: {
                                mCCId_memberId: {
                                    mCCId: mCC.id,
                                    memberId: memberId,
                                },
                            },
                            data: {
                                configurationData: inputCustomData,
                            },
                        });
                    console.log(updateMemberData);
                } else {
                    const createMemberData =
                        await prisma.configurationsMemberData.create({
                            data: {
                                mCCId: mCC.id,
                                memberId: memberId,
                                configurationData: inputCustomData,
                            },
                        });
                    console.log(createMemberData);
                }
            });
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: '異常が発生しました。',
            };
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.format(),
                message: '異常が発生しました。',
            };
        } else {
            console.error(error);
            return {
                success: false,
                message: '異常が発生しました。',
            };
        }
    }

    // 全部やって問題なかったら戻す
    return {
        success: true,
        message: '登録に成功しました。',
    };
}
