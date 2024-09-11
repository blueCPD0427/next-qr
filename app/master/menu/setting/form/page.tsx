import { auth } from '@/auth';
import prisma from '@/app/lib/prisma';
import MasterCustomFormComponent from './master-custom-form';
import MasterCustomFormList from './master-custom-form-list';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Prisma } from '@prisma/client';
import { mCCTypes } from '@/app/lib/difinitions';

export type MastersCustomConfigurationsListReturnType =
    Prisma.PromiseReturnType<typeof getMastersCustomConfigurations>;

async function getMastersCustomConfigurations(masterId: string) {
    const mCClist = await prisma.mastersCustomConfigurations.findMany({
        where: {
            masterId: masterId,
        },
        select: {
            id: true,
            masterId: true,
            configurationTitle: true,
            configurationConstraint: true,
        },
    });

    return mCClist;
}

export default async function SettingFormPage({
    searchParams,
}: {
    searchParams?: { disSetting?: string };
}) {
    const session = await auth();
    const masterId = session?.user?.id;
    if (masterId == undefined) {
        redirect('/404');
    }

    const mCClist = await getMastersCustomConfigurations(masterId);

    const mCCTypes: mCCTypes = {
        text: 'テキスト',
        int: '数値',
        boolean: 'ON/OFF',
    };

    // 各メンバーの現在のカスタムデータをクリックしたら表示できるようにする
    // 増えると画面が鬱陶しいから開閉式
    // 簡単な検索フォームくらいあってもいいかもしんない

    return (
        <div className="flex justify-center mt-20">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto max-h-screen-80">
                {searchParams != undefined &&
                    searchParams.disSetting != undefined &&
                    searchParams.disSetting == 'true' && (
                        <div className="w-full text-center">
                            <p className="text-red-500 font-bold">
                                以下の項目設定を先に登録してください。
                            </p>
                        </div>
                    )}
                <div className="mb-10">
                    <div>
                        <div>登録済みの項目</div>
                        {mCClist.length > 0 ? (
                            <div className="bg-white rounded p-3">
                                <MasterCustomFormList
                                    mCClist={mCClist}
                                    mCCTypes={mCCTypes}
                                    masterId={masterId}
                                />
                            </div>
                        ) : (
                            <Alert className="bg-white p-3">
                                <AlertDescription>
                                    <FontAwesomeIcon
                                        className="text-orange-500 font-bold mr-3"
                                        icon={faTriangleExclamation}
                                    />
                                    登録されているフォームはありません。
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
                {mCClist.length >= 5 ? (
                    <Alert>
                        <AlertDescription>
                            <FontAwesomeIcon
                                className="text-orange-500 font-bold mr-3"
                                icon={faTriangleExclamation}
                            />
                            フォーム追加の上限に達したため、新規追加はできません
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="mt-5">
                        <div>
                            新規登録
                            <span className="text-sm font-bold">
                                ※最大5つまで
                            </span>
                        </div>
                        <div>
                            <MasterCustomFormComponent
                                mCCTypes={mCCTypes}
                                masterId={masterId}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
