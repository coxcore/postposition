export function check(text:string, type?:string):boolean;
export function pick(text:string, type:string, special?:string):string;
export function put(text:string, type:string, special?:string):string;
export function fix(type:string, special?:string):Function;
export function parse(text:string):string;

export interface postposition {
  check: Function;
  pick: Function;
  put: Function;
  fix: Function;
  parse: Function;
}

declare const postposition: postposition;

export default postposition;
