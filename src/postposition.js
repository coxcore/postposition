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
const REG_INVALID_CHAR = /[^a-zA-Z0-9ㄱ-ㅎ가-힣]*/g;

/**
 * 종성이 없는 조건 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_FIXED_NORMAL = new RegExp(`(?:${[
    "check|[hm]ook",
].join("|")})$`, "i");

/**
 * 종성이 있는 조건 정규식
 *
 * @private
 * @type {RegExp}
 */
const REG_SPECIAL_CHAR = new RegExp(`(?:${[
    "[ㄱ-ㅎ]",
    "[013678]",
    "^[lmnr]",
    "\\S+[lmn]e?",
    "(?:[aeiom]|\\Slu)b",
    "(?:[aeiu]|[^o]o)p",
    "(?:[iu]|[^e][ae]|[^o]o)t",
    "(?:[iou]|[^e][ae])c?k",
    "[aeiou](?:c|ng)",
    "app|foot|go+d|big|bag",
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
    "\\S+le?",
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
 * 조사가 '로'면 종성이 리을이 아닌 조건
 *
 * @private
 * @param type {string} 조사
 * @param state {boolean} 종성이 있는지 여부
 * @return {boolean}
 */
const checkRo = (type, state) => (type !== "로" && type !== "으로") || !state;

/**
 * 종성이 있는 문자열 체크
 *
 * @private
 * @param text {string} 종성이 있는지를 확인할 문자열
 * @param type {string} 조사
 * @return {boolean}
 */
const checkText = (text, type) =>
    // 지정한 종성이 없는 글자가 아닌 경우
    !REG_FIXED_NORMAL.test(text) &&
    // 종성이 있을 때
    REG_SPECIAL_CHAR.test(text) &&
    // 조사가 '로'인 경우 구분
    checkRo(type, REG_SPECIAL_RO.test(text));

/**
 * 종성이 있는 한글의 유니 코드 체크
 *
 * @private
 * @param code {number} 유니 코드
 * @param type {string} 조사('로/으로'의 경우가 아니면 type 파라미터를 생략)
 * @returns {boolean}
 */
const checkCode = (code, type) => {
    const finalConsonantCode = (code - KO_START_CODE) % 28;

    // 조사가 '로'면 종성이 리을이 아닐 때
    return finalConsonantCode !== 0 && checkRo(type, finalConsonantCode === 8);
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
    const target = text.replace(REG_INVALID_CHAR, '');
    const code = target.charAt(target.length - 1).charCodeAt();
    const korean = KO_START_CODE <= code && code <= KO_FINISH_CODE;

    // 한글이면 종성이 있는 코드인지를 체크
    return korean ? checkCode(code, type) : checkText(target, type);
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
