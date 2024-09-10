// 全て半角数字かを判定
export function isHalfNumeric(number: string) {
    return /^[0-9]+$/.test(number);
}
