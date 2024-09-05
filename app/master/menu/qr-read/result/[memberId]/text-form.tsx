'use client';
import { OCCListInside } from "@/app/lib/difinitions";

export default function TextCustomFormPage(
    {
        oCCData
    }:{
        oCCData:OCCListInside
    }
){

    const defaultValue = oCCData.confMemberData != undefined ? oCCData.confMemberData[0] : null;

    return(
        <div>
            <label htmlFor={oCCData.id}>
                {oCCData.configurationTitle}
            </label>
            <input id={oCCData.id} type="text" name={oCCData.id + '_text'} defaultValue={defaultValue.configurationData} />
        </div>
    )
}