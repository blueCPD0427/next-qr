'use client';
import React, { useState, useReducer, useEffect } from 'react';
import { getAddressFromPostCode } from '@/app/lib/actions/action';
import {
    convertReplaceText,
    convertToHalfNumber,
} from '@/app/lib/actions/convert';
import { isHalfNumeric } from '@/app/lib/actions/judge';
import {
    MemberAccountForm,
    MemberAccountFormEdit,
} from '@/app/lib/difinitions';
import { MemberAccountValidateStateInside } from '@/app/member/account/actions';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const initForm: MemberAccountForm = {
    lastName: '',
    firstName: '',
    sex: '',
    email: '',
    password: '',
    confirmPassword: '',
    postCode: '',
    address: '',
    birthdayY: '',
    birthdayM: '',
    birthdayD: '',
};

type Action = {
    type: 'SET_FIELD';
    field: keyof MemberAccountForm;
    value: string;
};

function reducer(state: MemberAccountForm, action: Action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };
        default:
            return state;
    }
}

export default function AccountForm({
    editMemberData,
}: {
    editMemberData?: MemberAccountFormEdit;
}) {
    const initialState: MemberAccountValidateStateInside = {};

    const router = useRouter();

    // 住所欄の入力可能状態ステータス
    const [addresFormState, setAddresFormState] = useState(false);
    // 郵便番号検索のエラーテキスト
    const [postCodeError, setPostCodeError] = useState('');
    const [sendPending, setSendPending] = useState(false);

    const [selectedSexValue, setSelectedSexValue] = useState('');

    const sexRadioChange = (e: {
        target: { value: string; checked: boolean; name: string };
    }) => {
        const value = e.target.value;
        setSelectedSexValue(selectedSexValue === value ? '' : value);
        if (e.target.checked === true) {
            setFormValue(e.target.name, e.target.value);
        } else {
            setFormValue(e.target.name, '');
        }
    };

    const [errorField, setErrorField] = useState(initialState);

    // フォームの値処理関連
    const [formContents, dispatch] = useReducer(reducer, initForm);

    // editMemberDataの有無でCREATEかUPDATEか判断
    let formType = 'create';
    if (editMemberData != undefined) {
        formType = 'update';

        // 初期値をセット
        initForm.id = editMemberData.id;
        initForm.lastName = editMemberData.lastName;
        initForm.firstName = editMemberData.firstName;
        if (editMemberData.sex == 'male' || editMemberData.sex == 'female') {
            initForm.sex = editMemberData.sex;
        } else {
            initForm.sex = '';
        }
        initForm.email = editMemberData.email;
        initForm.postCode = editMemberData.postCode;
        initForm.address = editMemberData.address;
        initForm.birthdayY = String(editMemberData.birthdayY);
        initForm.birthdayM = String(editMemberData.birthdayM);
        initForm.birthdayD = String(editMemberData.birthdayD);
    }

    useEffect(() => {
        if (initForm.sex != null) {
            setSelectedSexValue(initForm.sex);
        }
    }, [initForm]);

    function setFormValue(formName: string, formValue: string) {
        dispatch({
            type: 'SET_FIELD',
            field: formName as keyof MemberAccountForm,
            value: formValue,
        });
    }

    const formChange = (e: { target: { name: string; value: string } }) => {
        setFormValue(e.target.name, e.target.value);
    };

    // 住所に反映ボタン処理
    async function getAddressClick() {
        // エラーを削除
        setPostCodeError('');

        // 現在のフォーム内容を取得
        let tmpPostCode = String(formContents.postCode);

        // 事前にハイフンの削除と全角数字を半角数字に変換を実行
        tmpPostCode = convertReplaceText(tmpPostCode, '-', ''); // 半角ハイフン除去
        tmpPostCode = convertReplaceText(tmpPostCode, '－', ''); // 全角ハイフン除去
        tmpPostCode = convertToHalfNumber(tmpPostCode); // 全角数字を半角に変換

        // 実行した内容をフォームに反映
        setFormValue('postCode', tmpPostCode);

        if (tmpPostCode.length != 7 || isHalfNumeric(tmpPostCode) === false) {
            setPostCodeError('郵便番号を再確認してください');
            return false;
        }

        const getAddressRes = await getAddressFromPostCode(tmpPostCode);

        if (getAddressRes === false) {
            setPostCodeError('住所の取得に失敗しました');
            return false;
        }

        // 取得したデータを反映
        const addressData = getAddressRes.addresses[0].ja;
        let addressText = '';
        addressText += addressData.prefecture;
        addressText += addressData.address1;
        addressText += addressData.address2;
        addressText += addressData.address3;
        addressText += addressData.address4;
        setFormValue('address', addressText);
        setAddresFormState(true);
    }

    const formSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setSendPending(true);

        if (formType === 'create') {
            const response = await fetch('/api/member-account-create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formContents),
            });
            const result = await response.json();
            if (result.data.success === false) {
                toast.error('アカウントの登録に失敗しました。');
                setErrorField(result.data.errors);
                setSendPending(false);
            } else {
                toast.success(
                    'アカウントの登録に成功しました。\n登録したアカウントでログインしてください',
                );
                router.push('/member/login');
            }
        } else if (formType === 'update') {
            const response = await fetch('/api/member-account-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formContents),
            });
            const result = await response.json();
            if (result.data.success === false) {
                toast.error('アカウントの更新に失敗しました。');
                setErrorField(result.data.errors);
                setSendPending(false);
            } else {
                toast.success('アカウントの更新に成功しました。');

                // パスワード欄を空にする
                setFormValue('password', '');
                setFormValue('confirmPassword', '');
                setSendPending(false);
            }
        } else {
            router.push('/404');
        }
    };

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 1980; i <= currentYear; i++) {
        years.push(i);
    }

    const months = [];
    for (let i = 1; i <= 12; i++) {
        months.push(i);
    }

    const days = [];
    for (let i = 1; i <= 31; i++) {
        days.push(i);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto max-h-screen-80">
                <h2 className="text-2xl font-bold mb-6 text-green-700">
                    メンバーアカウント作成
                </h2>
                <form onSubmit={formSubmit}>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            お名前
                        </label>
                        <div>
                            <div className=" mb-2">
                                <label className="block text-green-700 text-sm mb-1">
                                    姓
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    name="lastName"
                                    value={formContents.lastName}
                                    onChange={formChange}
                                />
                                {errorField?.lastName?._errors &&
                                    errorField?.lastName._errors.map(
                                        (error: string) => (
                                            <p
                                                className="mt-2 text-sm text-red-500"
                                                key={error}
                                            >
                                                {error}
                                            </p>
                                        ),
                                    )}
                            </div>
                            <label className="block text-green-700 text-sm mb-1">
                                名
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                name="firstName"
                                value={formContents.firstName}
                                onChange={formChange}
                            />
                            {errorField?.firstName?._errors &&
                                errorField?.firstName._errors.map(
                                    (error: string) => (
                                        <p
                                            className="mt-2 text-sm text-red-500"
                                            key={error}
                                        >
                                            {error}
                                        </p>
                                    ),
                                )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            性別
                            <span className="text-sm px-2 py-1 bg-orange-500 text-white rounded-lg ml-2">
                                任意
                            </span>
                        </label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="sex"
                                    value="male"
                                    checked={selectedSexValue === 'male'}
                                    onChange={sexRadioChange}
                                />
                                男性
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="sex"
                                    className="ml-3"
                                    value="female"
                                    checked={selectedSexValue === 'female'}
                                    onChange={sexRadioChange}
                                />
                                女性
                            </label>
                        </div>
                        {errorField?.sex?._errors &&
                            errorField?.sex._errors.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            生年月日
                        </label>
                        <div>
                            <select
                                name="birthdayY"
                                onChange={formChange}
                                defaultValue={initForm.birthdayY}
                            >
                                <option value="" disabled></option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            年
                            <select
                                name="birthdayM"
                                onChange={formChange}
                                defaultValue={initForm.birthdayM}
                            >
                                <option value="" disabled></option>
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            月
                            <select
                                name="birthdayD"
                                onChange={formChange}
                                defaultValue={initForm.birthdayD}
                            >
                                <option value="" disabled></option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            日
                        </div>
                        {errorField?.birthday?._errors &&
                            errorField?.birthday._errors.map(
                                (error: string) => (
                                    <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                    >
                                        {error}
                                    </p>
                                ),
                            )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            所在地
                        </label>
                        <div>
                            <div className=" mb-2">
                                <label className="block text-green-700 text-sm mb-1">
                                    郵便番号
                                </label>
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    name="postCode"
                                    value={formContents.postCode}
                                    onChange={formChange}
                                    placeholder="ハイフン不要"
                                />
                                <button
                                    type="button"
                                    onClick={getAddressClick}
                                    className="ml-3 text-xs border rounded-lg border-black px-2 py-1 hover:bg-gray-300"
                                >
                                    住所に反映
                                </button>
                                <p className="text-red-700 font-bold">
                                    {postCodeError}
                                </p>
                                {errorField?.postCode?._errors &&
                                    errorField?.postCode._errors.map(
                                        (error: string) => (
                                            <p
                                                className="mt-2 text-sm text-red-500"
                                                key={error}
                                            >
                                                {error}
                                            </p>
                                        ),
                                    )}
                            </div>
                            <label className="block text-green-700 text-sm mb-1">
                                住所
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                name="address"
                                value={formContents.address}
                                onChange={formChange}
                                placeholder="郵便番号を入力後、「住所に反映」ボタンを押してください"
                                disabled={addresFormState === false}
                            />
                            {errorField?.address?._errors &&
                                errorField?.address._errors.map(
                                    (error: string) => (
                                        <p
                                            className="mt-2 text-sm text-red-500"
                                            key={error}
                                        >
                                            {error}
                                        </p>
                                    ),
                                )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            メールアドレス
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="email"
                            value={formContents.email}
                            onChange={formChange}
                        />
                        {errorField?.email?._errors &&
                            errorField?.email._errors.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            パスワード
                        </label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="password"
                            value={formContents.password}
                            onChange={formChange}
                        />
                        {errorField?.password?._errors &&
                            errorField?.password._errors.map(
                                (error: string) => (
                                    <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                    >
                                        {error}
                                    </p>
                                ),
                            )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-green-700 mb-2">
                            パスワード再確認
                        </label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="confirmPassword"
                            value={formContents.confirmPassword}
                            onChange={formChange}
                        />
                        {errorField?.confirmPassword?._errors &&
                            errorField?.confirmPassword._errors.map(
                                (error: string) => (
                                    <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                    >
                                        {error}
                                    </p>
                                ),
                            )}
                    </div>
                    <div className="flex justify-center w-full">
                        <button
                            className={clsx(
                                'border rounded py-1 px-3 bg-green-500 text-white font-bold',
                                {
                                    'opacity-50 cursor-wait':
                                        sendPending === true,
                                },
                            )}
                            aria-disabled={sendPending}
                        >
                            {sendPending ? '送信中' : '送信'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
