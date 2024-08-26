// 全角数字を半角に変換
export function convertToHalfNumber(number:string){
    let res = number;
    return res.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

// phpのstr_replaceのような関数
export function convertReplaceText(originText:string, targetText:string, replaceText = ''){
    let res = originText;
    return res.replace(new RegExp(targetText, 'g'), replaceText);
}


export function lPadNum(num:string, length:number){
    return String(num).padStart(length, '0');
}