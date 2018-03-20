/**
 * 한글 조사
 *
 * @author Park U-yeong (ascript0@gmail.com)
 * @license MIT
 */

/**
 * 한글 시작 유니 코드
 *
 * @private
 * @type {number}
 */
const KO_START_CODE = 44032;

/**
 * 한글 종료 유니 코드
 *
 * @private
 * @type {number}
 */
const KO_FINISH_CODE = 55203;

/**
 * 종성을 체크하지 않을 글자 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_INVALID_CHAR = /[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]+/g;

/**
 * 종성을 체크할 글자 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_TARGET_CHAR = /^[\s\S]*?(\S*)\s*$/;

/**
 * 종성이 없는 조건 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_NORMAL_FIXED = new RegExp(`(?:${[
    "check|[hm]ook|limit",
].join("|")})$`, "i");

/**
 * 종성이 있는 조건 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_SPECIAL_CHAR = new RegExp(`(?:${[
    "[ㄱ-ㄷㅁ-ㅎ]",
    "[036]",
    "^[mn]",
    "\\S[mn]e?",
    "\\S(?:[aeiom]|lu)b",
    "(?:u|\\S[aei]|[^o]o)p",
    "(?:^i|[^auh]i|\\Su|[^ei][ae]|[^oi]o)t",
    "(?:\\S[iou]|[^e][ae])c?k",
    "\\S[aeiou](?:c|ng)",
    "app|foot|go+d|big|bag|private",
].join("|")})$`, "i");

/**
 * 조사가 '로'일 때 종성이 없는 조건으로 간주하는 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_SPECIAL_RO = new RegExp(`(?:${[
    "[178ㄹ]",
    "^[lr]",
    "^[ou]r",
    "\\Sle?",
].join("|")})$`, "i");

/**
 * 기본적으로 지원하는 조사
 *
 * @private
 * @type {object}
 */
const DEFAULT_POSTPOSITION = {
    "은": "는",
    "이": "가",
    "과": "와",
    "이나": "나",
    "을": "를",
    "으로": "로",
};

/**
 * 종성이 있는 단어의 조사
 * 기본 조사의 key/value를 반대로 정의한 객체
 *
 * @private
 * @type {object}
 */
const SPECIAL_POSTPOSITION = (() => {
    const special = {};

    for (const key in DEFAULT_POSTPOSITION) {
        special[DEFAULT_POSTPOSITION[key]] = key;
    }

    return special;
})();

/**
 * 종성이 있는 문자열 체크
 *
 * @private
 * @param text {string} 종성이 있는지를 확인할 문자열
 * @param isRo {boolean} 조사가 '로/으로'인지 여부
 * @return {boolean}
 */
const checkText = (text, isRo) => {
    if (REG_NORMAL_FIXED.test(text)) {
        return false;
    }

    // 한글 외에 'ㄹ' 종성 판단은 종성 유무 조건과 분리하여 개별 처리
    return REG_SPECIAL_CHAR.test(text) || (!isRo && REG_SPECIAL_RO.test(text));
};

/**
 * 종성이 있는 한글의 유니 코드 체크
 *
 * @private
 * @param code {number} 유니 코드
 * @param isRo {boolean} 조사가 '로/으로'인지 여부
 * @returns {boolean}
 */
const checkCode = (code, isRo) => {
    const finalConsonantCode = (code - KO_START_CODE) % 28;

    // 종성이 있는 경우를 체크하고, 조사 '로'일 때 종성이 'ㄹ'인지 여부 추가 체크
    return finalConsonantCode !== 0 && !(isRo && finalConsonantCode === 8);
};

/**
 * 종성이 있는 문자열인지 여부
 * '로/으로'의 경우가 아니면 type 파라미터를 생략해도 된다.
 *
 * @param text 체크할 문자열
 * @param type 조사('로/으로'의 경우가 아니면 type 파라미터를 생략)
 * @returns {boolean}
 */
export const check = (text, type) => {
    const target = text.replace(REG_INVALID_CHAR, " ").replace(REG_TARGET_CHAR, "$1");
    const code = target.charAt(target.length - 1).charCodeAt();
    const isKorean = KO_START_CODE <= code && code <= KO_FINISH_CODE;
    const isRo = type === "로" || type === "으로";

    return isKorean ? checkCode(code, isRo) : checkText(target, isRo);
};

/**
 * 글자에 해당하는 조사를 반환
 * 아래 조사에 대해서는 special 파라미터를 전달하지 않아도 된다.
 * 은/는, 이/가, 을/를, 과/와, 로/으로
 *
 * @param text {string} 조사를 붙일 문자열
 * @param type {string} 조사
 * @param special {string} 종성이 있을 때 조사
 * @returns {string}
 */
export const pick = (text, type, special) => {
    if (typeof special !== "string") {
        type = DEFAULT_POSTPOSITION[type] || type || "";
        special = SPECIAL_POSTPOSITION[type] || type;
    }

    return check(text, type) ? special : type;
};

/**
 * 글자에 해당하는 조사를 붙인 글자를 반환
 * pick 메서드의 사용법과 동일하다.
 *
 * @param text {string} 조사를 붙일 문자열
 * @param type {string} 조사
 * @param special {string} 종성이 있을 때 조사
 * @return {string}
 */
export const put = (text, type, special) => `${text}${pick(text, type, special)}`;

/**
 * 특정 조사를 처리하는 함수를 반환
 * 같은 조사에 대한 처리가 반복되는 경우 특정 조사를 처리하는 함수를 생성하여 처리할 글자만 전달하여 사용한다.
 *
 * @param type {string} 조사
 * @param special {string} 종성이 없을 때 조사
 */
export const fix = (type, special) => function(text) {
    return put(text, type, special);
};

export default {
    check, pick, put, fix
}
