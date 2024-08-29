'use client';
import { OCCListInside } from "@/app/lib/difinitions";

export default function IntCustomFormPage(
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
            <input id={oCCData.id} type="text" name={oCCData.id + '_int'} />
        </div>
    )
}