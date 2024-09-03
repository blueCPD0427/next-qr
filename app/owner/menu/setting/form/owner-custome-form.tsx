'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useReducer } from "react";

interface CustomForm {
    configurationTitle: string,
    configurationConstraint: string,
}

const initForm:CustomForm = {
    configurationTitle: '',
    configurationConstraint: '',
}

type Action = { type: 'SET_FIELD'; field: keyof CustomForm; value: string };

function reducer(state:CustomForm, action:Action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        default:
            return state;
    }
}

export default function OwnerCustomForm({oCCTypes}:{oCCTypes:{
    text: string,
    int: string,
    boolean: string,
}})
{

    // フォームの値処理関連
    const [formContents, dispatch] = useReducer(reducer, initForm);
    function setFormValue(formName:string, formValue:string){
        dispatch({
            type: 'SET_FIELD',
            field: formName as keyof CustomForm,
            value: formValue
        });
    }

    const formChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(e.target.name, e.target.value);
    }

    const SelectChange = (value:string) => {
        setFormValue('configurationConstraint', value);
    }

    function displayClick(){
        console.log(formContents);
    }


    return(
        <div className="flex w-2/3">
            <div className="flex w-3/4">
                <div className="w-1/2 mr-3">
                    <Label htmlFor="title">データ名</Label>
                    <Input type="text" id="title" name="configurationTitle" onChange={formChange} />
                </div>
                <div className="mr-3">
                    <Label>データの形式</Label>
                    <Select name="configurationConstraint"  onValueChange={SelectChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.keys(oCCTypes).map((oCC)=>(
                                    <SelectItem key={oCC} value={oCC}>{oCCTypes[oCC]}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <button onClick={displayClick}>お試し</button>
            </div>
        </div>
    )
}