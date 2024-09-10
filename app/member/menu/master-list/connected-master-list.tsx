'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import clsx from 'clsx';
import { ToggleDispData } from '@/app/lib/difinitions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React from 'react';

export function ConnectedMasterList({
    connectedMasterList,
    memberId,
}: {
    connectedMasterList: any;
    memberId: string;
}) {
    const [sendPending, setSendPending] = useState(false);
    const router = useRouter();

    const toggleDispData = async (masterId: string, target: string) => {
        const sendData: ToggleDispData = {
            masterId: masterId,
            memberId: memberId,
            target: target,
        };

        const response = await fetch('/api/member-toggle-disp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendData),
        });
        const result = await response.json();
        if (result.data.success === false) {
            toast.error('公開情報の変更に失敗しました。');
            setSendPending(false);
        } else {
            toast.success('公開情報の変更に成功しました。');
            setSendPending(false);
            router.refresh();
        }
    };

    return (
        <div className="bg-white rounded p-5 w-4/5">
            <Table className="whitespace-nowrap">
                <TableHeader>
                    <TableRow className="border-black">
                        <TableHead className="w-1/5">連携先</TableHead>
                        <TableHead className="w-2/5">住所</TableHead>
                        <TableHead className="w-1/5">住所の公開</TableHead>
                        <TableHead className="w-1/5">生年月日の公開</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {connectedMasterList &&
                        connectedMasterList.map((value: any) => (
                            <React.Fragment key={value.master.id}>
                                <TableRow className="border-b-0 border-black">
                                    <TableCell className="w-1/5">
                                        {value.master.name}
                                    </TableCell>
                                    <TableCell className="w-2/5">
                                        {value.master.address}
                                    </TableCell>
                                    <TableCell className="w-1/5">
                                        <div className="flex justify-between items-center px-3">
                                            <span>
                                                {value.addressDisp === true
                                                    ? '公開'
                                                    : '非公開'}
                                            </span>
                                            <Button
                                                type="button"
                                                className={clsx(
                                                    'font-bold bg-orange-500 hover:bg-orange-700',
                                                    {
                                                        'bg-blue-500 hover:bg-blue-700':
                                                            value.addressDisp ===
                                                            true,
                                                    },
                                                )}
                                                aria-disabled={sendPending}
                                                onClick={() =>
                                                    toggleDispData(
                                                        value.master.id,
                                                        'addressDisp',
                                                    )
                                                }
                                            >
                                                {value.addressDisp === true
                                                    ? '非公開に変更'
                                                    : '公開に変更'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-1/5">
                                        <div className="flex justify-between items-center px-3">
                                            <span>
                                                {value.birthdayDisp === true
                                                    ? '公開'
                                                    : '非公開'}
                                            </span>
                                            <Button
                                                type="button"
                                                className={clsx(
                                                    'font-bold bg-orange-500 hover:bg-orange-700',
                                                    {
                                                        'bg-blue-500 hover:bg-blue-700':
                                                            value.birthdayDisp ===
                                                            true,
                                                    },
                                                )}
                                                aria-disabled={sendPending}
                                                onClick={() =>
                                                    toggleDispData(
                                                        value.master.id,
                                                        'birthdayDisp',
                                                    )
                                                }
                                            >
                                                {value.birthdayDisp === true
                                                    ? '非公開に変更'
                                                    : '公開に変更'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="border-black">
                                    <TableCell colSpan={4}>
                                        <div>現在の登録データ：</div>
                                        <div className="flex align-middle">
                                            {value.member.confMemberData
                                                .length > 0 ? (
                                                value.member.confMemberData.map(
                                                    (cMData: any) =>
                                                        cMData
                                                            .customConfiguration
                                                            .configurationTitle && (
                                                            <div
                                                                key={
                                                                    cMData.mCCId
                                                                }
                                                            >
                                                                【
                                                                {
                                                                    cMData
                                                                        .customConfiguration
                                                                        .configurationTitle
                                                                }
                                                                】
                                                                {
                                                                    cMData.configurationData
                                                                }
                                                            </div>
                                                        ),
                                                )
                                            ) : (
                                                <div>
                                                    現在登録されているデータはありません
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
