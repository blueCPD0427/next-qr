'use client';
import { OCCListInside } from "@/app/lib/difinitions";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function BooleanCustomFormPage(
    {
        oCCData
    }:{
        oCCData:OCCListInside
    }
){

    const confMemberData = oCCData.confMemberData != undefined ? oCCData.confMemberData[0] : null;
    let defaultValue = '';
    if(confMemberData != undefined){
        defaultValue = confMemberData.configurationData;
    }

    const [isChecked, setIsChecked] = useState(defaultValue != undefined && defaultValue === "true");

    const checkedChange = (state:boolean) => {
        setIsChecked(state);
    };

    return(
        <div>
            <div className="items-top flex space-x-2">
                <Checkbox
                    id={oCCData.id}
                    name={oCCData.id + '_boolean'}
                    value="true"
                    checked={isChecked}
                    onCheckedChange={(value:boolean)=>checkedChange(value)}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={oCCData.id}>
                        {oCCData.configurationTitle}
                    </Label>
                </div>
            </div>
        </div>
    )
}