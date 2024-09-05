'use client';
import React, { useState, useReducer,useEffect } from "react";
import { MemberConnectForm } from "@/app/lib/difinitions";
import { MemberConnectValidateStateInside } from "@/app/member/menu/connect/actions";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MasterData } from "@/app/lib/difinitions";

const initForm:MemberConnectForm = {
    addressDisp: '',
    birthdayDisp: '',
    masterId: ''
}

type Action = { type: 'SET_FIELD'; field: keyof MemberConnectForm; value: string };

function reducer(state:MemberConnectForm, action:Action) {
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

export default function ConnectForm({masterData}:{masterData:MasterData}){

    const initialState:MemberConnectValidateStateInside = {};

    const router = useRouter();

    const [errorField, setErrorField] = useState(initialState);
    const [sendPending, setSendPending] = useState(false);

    // フォームの値処理関連
    const [formContents, dispatch] = useReducer(reducer, initForm);

    function setFormValue(formName:string, formValue:string){
        dispatch({
            type: 'SET_FIELD',
            field: formName as keyof MemberConnectForm,
            value: formValue
        });
    }

    const formChange = (e: { target: { name: string; value: string; }; }) => {
        setFormValue(e.target.name, e.target.value);
    }

    // マスターIDとメンバーIDをセット
    useEffect(()=>{
        setFormValue('masterId', masterData.id);
    },[]);

    const formSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSendPending(true);

        const response = await fetch('/api/member-connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formContents),
        });
        const result = await response.json();
        if(result.data.success === false){
            toast.error('連携に失敗しました。');
            console.log(result.data);
            setErrorField(result.data.errors);
            setSendPending(false);
        }else{
            toast.success('連携に成功しました。');
            router.push('/member/menu');
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto max-h-screen-80">
                <h2 className="text-2xl font-bold mb-6 text-green-700">
                    【{masterData.name}】との連携確認
                </h2>
                <div className="mb-2">
                    以下の情報を{masterData.name}に対して公開するか選択してください。
                    <br/>※公開の設定は「連携先一覧」より変更可能です。
                </div>
                <form onSubmit={formSubmit}>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            住所の公開
                        </label>
                        <div>
                            <label>
                                <input
                                type="radio"
                                name="addressDisp"
                                value="true"
                                onChange={formChange}
                                />
                                公開
                            </label>
                            <label>
                                <input
                                type="radio"
                                name="addressDisp"
                                className="ml-3"
                                value="false"
                                onChange={formChange}
                                />
                                非公開
                            </label>
                        </div>
                        {
                            errorField?.addressDisp?._errors &&
                            errorField?.addressDisp._errors.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            誕生日の公開
                        </label>
                        <div>
                            <label>
                                <input
                                type="radio"
                                name="birthdayDisp"
                                value="true"
                                onChange={formChange}
                                />
                                公開
                            </label>
                            <label>
                                <input
                                type="radio"
                                name="birthdayDisp"
                                className="ml-3"
                                value="false"
                                onChange={formChange}
                                />
                                非公開
                            </label>
                        </div>
                        {
                            errorField?.birthdayDisp?._errors &&
                            errorField?.birthdayDisp._errors.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    <button
                        className={clsx('border rounded py-1 px-3 bg-green-500',{
                            'opacity-50 cursor-wait' : sendPending === true
                        })} aria-disabled={sendPending}>
                        {sendPending ? '送信中' : '送信'}
                    </button>
                </form>
            </div>
        </div>
    )
}