'use client';

import { useFormState } from "react-dom";
import { setCustomForm } from "../../actions";
import TextCustomFormPage from "@/app/master/menu/qr-read/result/[memberId]/text-form";
import IntCustomFormPage from "@/app/master/menu/qr-read/result/[memberId]/int-form";
import BooleanCustomFormPage from "@/app/master/menu/qr-read/result/[memberId]/boolean-form";
import { SubmitButton } from "@/app/lib/component-parts/buttons";
import toast from "react-hot-toast";

export default function CustomFormBase({oCClist,memberId}:{oCClist,memberId:string})
{
    const initialState = {};
    const [state, dispatch] = useFormState(setCustomForm, initialState);

    if(state.success != undefined){
        switch(true){
            case state.success === true:
                toast.success(state.message);
                break;
            case state.success === false:
                toast.error(state.message);
                break;
        }
    }

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
            <input type="hidden" name="memberId" value={memberId} />
            <SubmitButton />
        </form>
    )
}