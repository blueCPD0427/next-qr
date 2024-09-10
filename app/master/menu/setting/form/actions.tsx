'use server';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { MasterCustomForm } from '@/app/lib/difinitions';
import { existMaster } from '@/app/lib/actions/action';
import { DeleteMasterCustomForm } from '@/app/lib/difinitions';

const MasterCustomFormSchema = z.object({
    masterId: z
        .string()
        .min(1, { message: 'システムエラーが発生しました。' })
        .superRefine(async (data: any, ctx) => {
            const existMasterRes = await existMaster(data.masterId);

            if (!existMasterRes) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '送信されたパラメータが不正です。',
                    path: ['masterId'],
                });
            }
        }),
    configurationTitle: z.string().min(1, { message: 'データ名は必須です。' }),
    configurationConstraint: z.enum(['text', 'int', 'boolean'], {
        message: 'データの形式が正しくありません。',
    }),
});

export async function createMasterCustomFormApi(formData: MasterCustomForm) {
    try {
        const validatedFields = await MasterCustomFormSchema.parseAsync({
            masterId: formData.masterId,
            configurationTitle: formData.configurationTitle,
            configurationConstraint: formData.configurationConstraint,
        });

        const { masterId, configurationTitle, configurationConstraint } =
            validatedFields;

        try {
            await prisma.mastersCustomConfigurations.create({
                data: {
                    masterId: masterId,
                    configurationTitle: configurationTitle,
                    configurationConstraint: configurationConstraint,
                },
            });
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'データ項目の登録に失敗しました。',
            };
        }
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };
}

export async function deleteMasterCustomFormApi(
    formData: DeleteMasterCustomForm,
) {
    const DeleteMasterCustomFormSchema = z.object({
        masterId: z
            .string()
            .min(1, { message: 'システムエラーが発生しました。' })
            .superRefine(async (data: any, ctx) => {
                const existMasterRes = await existMaster(data.masterId);

                if (!existMasterRes) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: '送信されたパラメータが不正です。',
                        path: ['masterId'],
                    });
                }
            }),
        formId: z
            .string()
            .min(1, { message: 'システムエラーが発生しました。' })
            .superRefine(async (data: any, ctx) => {
                const existMasterCustomForm =
                    await prisma.mastersCustomConfigurations.findFirst({
                        where: {
                            id: data.formId,
                        },
                    });

                if (!existMasterCustomForm) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: '送信されたパラメータが不正です。',
                        path: ['formId'],
                    });
                }
            }),
    });

    try {
        const validatedFields = await DeleteMasterCustomFormSchema.parseAsync({
            masterId: formData.masterId,
            formId: formData.formId,
        });

        const { masterId, formId } = validatedFields;

        try {
            await prisma.mastersCustomConfigurations.delete({
                where: {
                    id: formId,
                    masterId: masterId,
                },
            });
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'データ項目の削除に失敗しました。',
            };
        }
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.format() };
        }
    }

    console.log('api success!!!!!');
    return { success: true };
}
