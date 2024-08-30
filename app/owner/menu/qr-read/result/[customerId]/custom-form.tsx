'use client';

import { useState } from "react";
import { useFormState } from "react-dom";
import { setCustomForm } from "../../actions";
import TextCustomFormPage from "@/app/owner/menu/qr-read/result/[customerId]/text-form";
import IntCustomFormPage from "@/app/owner/menu/qr-read/result/[customerId]/int-form";
import BooleanCustomFormPage from "@/app/owner/menu/qr-read/result/[customerId]/boolean-form";

export default function CustomFormBase({oCClist,customerId}:{oCClist,customerId:string})
{
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(setCustomForm, initialState);

    // なんとかしてこの値をsetCustomFormに送信する
    console.log(customerId);


    return (
        <form action={dispatch}>
            {
                oCClist && oCClist.map((oCC) => {
                    switch (oCC.configurationConstraint) {
                        case 'text':
                            return <TextCustomFormPage key={oCC.id} oCCData={oCC} />;
                        case 'int':
                            return <IntCustomFormPage key={oCC.id} oCCData={oCC} />;
                        case 'boolean':
                            return <BooleanCustomFormPage key={oCC.id} oCCData={oCC} />;
                        default:
                            return null;
                    }
                })
            }
            <button type="submit">
                送信
            </button>
        </form>
    )
}