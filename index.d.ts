type check = (text: string, type?: string) => boolean;
type pick = (text: string, type: string, special?: string) => string;
type put = (text: string, type: string, special?: string) => string;
type fix = (type: string, special?: string) => (text: string) => string;
type parse = (text: string) => string;

declare const postposition: {
  check: check;
  pick: pick;
  put: put;
  fix: fix;
  parse: parse;
};

export const check: check;
export const pick: pick;
export const put: put;
export const fix: fix;
export const parse: parse;

export default postposition;
