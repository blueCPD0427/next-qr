'use client';
import { OCCListInside } from "@/app/lib/difinitions";

export default function IntCustomFormPage(
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
            <input id={oCCData.id} type="text" name={oCCData.id + '_int'} defaultValue={defaultValue.configurationData} />
        </div>
    )
}