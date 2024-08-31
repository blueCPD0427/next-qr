'use client';
import { OCCListInside } from "@/app/lib/difinitions";

export default function BooleanCustomFormPage(
    {
        oCCData
    }:{
        oCCData:OCCListInside
    }
){

    const defaultValue = oCCData.confCustomerData != undefined ? oCCData.confCustomerData[0] : null;
    return(
        <div>
            <label htmlFor={oCCData.id}>
                {oCCData.configurationTitle}
            </label>
            <input id={oCCData.id} type="checkbox" name={oCCData.id + '_bool'} value="true" checked={defaultValue.configurationData === "true" ? true : false} />
        </div>
    )
}