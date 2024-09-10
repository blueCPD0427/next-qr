// 全角数字を半角に変換
export function convertToHalfNumber(number: string) {
    const res = number;
    return res.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
}

// phpのstr_replaceのような関数
export function convertReplaceText(
    originText: string,
    targetText: string,
    replaceText = '',
) {
    const res = originText;
    return res.replace(new RegExp(targetText, 'g'), replaceText);
}

export function lPadNum(num: string, length: number) {
    return String(num).padStart(length, '0');
}

// Dateを年月日表記に変換
export function convertDate(date: Date) {
    const convertDate = new Date(date);
    const year = convertDate.getFullYear();
    const month = convertDate.getMonth() + 1;
    const day = convertDate.getDate();

    const formatDate = year + '年' + month + '月' + day + '日';

    return formatDate;
}
