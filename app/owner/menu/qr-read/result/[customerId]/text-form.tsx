'use client';

export default function TextCustomFormPage(
    {
        formId
    }:{
        formId:string
    }
){
    return(
        <div key={formId}>
            <input type="text" name={formId + '_text'} />
        </div>
    )
}