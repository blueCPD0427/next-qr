'use client';
import { OCCListInside } from "@/app/lib/difinitions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function IntCustomFormPage(
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

    return(
        <div>
            <Label htmlFor={oCCData.id}>
                {oCCData.configurationTitle}
            </Label>
            <Input id={oCCData.id} type="text" name={oCCData.id + '_int'} defaultValue={defaultValue.configurationData != undefined ? defaultValue.configurationData : ''} />
        </div>
    )
}