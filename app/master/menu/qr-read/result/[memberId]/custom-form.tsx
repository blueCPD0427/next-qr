'use client';

import { useFormState } from 'react-dom';
import { setCustomForm } from '../../actions';
import TextCustomFormPage from '@/app/master/menu/qr-read/result/[memberId]/text-form';
import IntCustomFormPage from '@/app/master/menu/qr-read/result/[memberId]/int-form';
import BooleanCustomFormPage from '@/app/master/menu/qr-read/result/[memberId]/boolean-form';
import { SubmitButton } from '@/app/lib/component-parts/buttons';
import toast from 'react-hot-toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function CustomFormBase({
    mCClist,
    memberId,
    memberName,
}: {
    mCClist: any;
    memberId: string;
    memberName: string;
}) {
    const initialState: any = {};
    const [state, dispatch] = useFormState(setCustomForm, initialState);

    if (state.success != undefined) {
        switch (true) {
            case state.success === true:
                toast.success(state.message);
                break;
            case state.success === false:
                console.error(state.errors);
                toast.error(state.message);
                break;
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto max-h-screen-80">
                <form action={dispatch}>
                    <Card>
                        <CardHeader>
                            <CardTitle>【{memberName}】様</CardTitle>
                        </CardHeader>
                        {mCClist &&
                            mCClist.map((mCC: any) => {
                                switch (mCC.configurationConstraint) {
                                    case 'text':
                                        return (
                                            <CardContent key={mCC.id}>
                                                <TextCustomFormPage
                                                    mCCData={mCC}
                                                />
                                                {state?.errors != undefined &&
                                                    state?.errors[
                                                        mCC.id + '_text'
                                                    ] != undefined &&
                                                    state?.errors[
                                                        mCC.id + '_text'
                                                    ].map((error: string) => (
                                                        <p
                                                            className="mt-2 text-sm text-red-500"
                                                            key={error}
                                                        >
                                                            {error}
                                                        </p>
                                                    ))}
                                            </CardContent>
                                        );
                                    case 'int':
                                        return (
                                            <CardContent key={mCC.id}>
                                                <IntCustomFormPage
                                                    mCCData={mCC}
                                                />
                                                {state?.errors != undefined &&
                                                    state.errors[
                                                        mCC.id + '_int'
                                                    ] != undefined &&
                                                    state.errors[
                                                        mCC.id + '_int'
                                                    ].map((error: string) => (
                                                        <p
                                                            className="mt-2 text-sm text-red-500"
                                                            key={error}
                                                        >
                                                            {error}
                                                        </p>
                                                    ))}
                                            </CardContent>
                                        );
                                    case 'boolean':
                                        return (
                                            <CardContent key={mCC.id}>
                                                <BooleanCustomFormPage
                                                    mCCData={mCC}
                                                />
                                                {state?.errors != undefined &&
                                                    state.errors[
                                                        mCC.id + '_boolean'
                                                    ] != undefined &&
                                                    state.errors[
                                                        mCC.id + '_boolean'
                                                    ].map((error: string) => (
                                                        <p
                                                            className="mt-2 text-sm text-red-500"
                                                            key={error}
                                                        >
                                                            {error}
                                                        </p>
                                                    ))}
                                            </CardContent>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        <CardFooter className="flex justify-center">
                            <input
                                type="hidden"
                                name="memberId"
                                value={memberId}
                            />
                            <SubmitButton />
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
}
