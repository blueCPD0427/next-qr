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
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useReducer,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OwnerCustomForm } from "@/app/lib/difinitions";

let initForm:OwnerCustomForm = {
    ownerId: '',
    configurationTitle: '',
    configurationConstraint: '',
}

type Action = { type: 'SET_FIELD' | 'RESET'; field: keyof OwnerCustomForm; value: string };

function reducer(state:OwnerCustomForm, action:Action) {
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

export default function OwnerOwnerCustomForm({oCCTypes,ownerId}:{oCCTypes:{
    text: string,
    int: string,
    boolean: string,
},
ownerId:string})
{
    const router = useRouter();

    // フォームの値処理関連
    const [formContents, dispatch] = useReducer(reducer, initForm);
    const [sendPending, setSendPending] = useState(false);

    function setFormValue(formName:string, formValue:string){
        dispatch({
            type: 'SET_FIELD',
            field: formName as keyof OwnerCustomForm,
            value: formValue
        });
    }

    const formChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(e.target.name, e.target.value);
    }

    const SelectChange = (value:string) => {
        setFormValue('configurationConstraint', value);
    }

    async function displayClick(){
        setSendPending(true);
        // データが空だったらAPIに渡す前にエラー出す
        if(formContents.configurationTitle == ''){
            toast.error('データ名を入力してください');
            setSendPending(false);
            return false;
        }
        if(formContents.configurationConstraint == ''){
            toast.error('データの形式を選択して下さい');
            setSendPending(false);
            return false;
        }

        // オーナーIDをセット
        formContents.ownerId = ownerId;

        const response = await fetch('/api/owner-custom-form-create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formContents),
        });
        const result = await response.json();
        if(result.data.success === false){
            toast.error('データ項目の登録に失敗しました。');
            setSendPending(false);
        }else{
            toast.success('データ項目の登録に成功しました。');
            setFormValue('ownerId', '');
            setFormValue('configurationTitle', '');
            setFormValue('configurationConstraint', '');
            setSendPending(false);
            router.refresh();
        }

    }


    return(
        <div className="flex w-2/3">
            <div className="flex w-3/4 items-end">
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
                                    <SelectItem key={oCC} value={oCC}>
                                        {
                                            oCCTypes[oCC]
                                        }
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" className="bg-green-500 hover:bg-green-700 font-bold" aria-disabled={sendPending}>
                            登録
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                <span className="text-red-500 font-bold">
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                    一度登録した内容は変更ができません
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                データを登録してもよろしいでしょうか
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                いいえ
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={displayClick} className="bg-green-500 hover:bg-green-700">
                                はい
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}