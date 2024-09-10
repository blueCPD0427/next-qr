'use client';
import { OCCListInside } from '@/app/lib/difinitions';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export default function BooleanCustomFormPage({
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

    const [isChecked, setIsChecked] = useState(
        defaultValue != undefined && defaultValue === 'true',
    );

    const checkedChange = (state: boolean) => {
        setIsChecked(state);
    };

    return (
        <div>
            <div className="items-top flex space-x-2">
                <Checkbox
                    id={mCCData.id}
                    name={mCCData.id + '_boolean'}
                    value="true"
                    checked={isChecked}
                    onCheckedChange={(value: boolean) => checkedChange(value)}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={mCCData.id}>
                        {mCCData.configurationTitle}
                    </Label>
                </div>
            </div>
        </div>
    );
}
