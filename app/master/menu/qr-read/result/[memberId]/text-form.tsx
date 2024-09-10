'use client';
import { OCCListInside } from '@/app/lib/difinitions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TextCustomFormPage({
    mCCData,
}: {
    mCCData: OCCListInside;
}) {
    const confMemberData =
        mCCData.confMemberData != undefined ? mCCData.confMemberData[0] : null;
    let defaultValue = '';
    if (
        confMemberData != undefined &&
        confMemberData.configurationData != undefined
    ) {
        defaultValue = confMemberData.configurationData;
    }

    return (
        <div>
            <Label htmlFor={mCCData.id}>{mCCData.configurationTitle}</Label>
            <Input
                id={mCCData.id}
                type="text"
                name={mCCData.id + '_text'}
                defaultValue={defaultValue}
            />
        </div>
    );
}
