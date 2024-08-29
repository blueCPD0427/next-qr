'use client';
import { OCCListInside } from "@/app/lib/difinitions";

export default function BooleanCustomFormPage(
    {
        oCCData
    }:{
        oCCData:OCCListInside
    }
){

    return(
        <div>
            <label htmlFor={oCCData.id}>
                {oCCData.configurationTitle}
            </label>
            <input id={oCCData.id} type="checkbox" name={oCCData.id + '_text'} defaultValue={oCCData.confCustomerData?.configurationData} />
        </div>
    )
}