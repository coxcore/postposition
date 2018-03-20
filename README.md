# cox.postposition
> 한글, 영문, 숫자에 대한 한글 조사를 선택하거나 적용합니다. 단, 영문은 모든 상황에 대해 100% 지원하지 않습니다.

## 예제

[예제 보기](https://cdn.rawgit.com/coxcore/postposition/1.0.1/demo/index.html)

## 설치하기

#### NPM

```html
$ npm install cox-postposition
```

`npm install`을 통해 설치하는 경우 `ES6` 문법으로 작성한 원본 JS 파일을 참조합니다.
따라서 `ES6`를 지원하지 않는 환경에서는 [UMD](#umd) 사용법을 참고하여 사용하시기 바랍니다

#### CDN
```html
https://cdn.rawgit.com/coxcore/postposition/1.0.1/dist/cox.postposition.min.js
```

#### DOWNLOAD
- [Github](https://github.com/coxcore/postposition/releases)


## 사용법

#### ES6
```js
import postposition from 'cox-postposition';

const kor = postposition.put('고양이', '을');
const eng = postposition.put('cat', '을');
const num = postposition.put('8', '을');

console.log(kor); // 고양이를
console.log(eng); // cat을 ('씨에이티를'이 아닌 '캣을'로 처리)
console.log(num); // 8을
```

#### UMD - ES6 Module을 지원하지 않는 환경

```js
const postposition = require('cox-postposition/dist/cox.postposition.min.js');

const kor = postposition.put('고양이', '을');
const eng = postposition.put('cat', '을');
const num = postposition.put('8', '을');

console.log(kor); // 고양이를
console.log(eng); // cat을 ('씨에이티를'이 아닌 '캣을'로 처리)
console.log(num); // 8을
```

#### HTML

```html
<script src="https://cdn.rawgit.com/coxcore/postposition/1.0.1/dist/cox.postposition.min.js"></script>

<script>
  var kor = cox.postposition.put('고양이', '을');
  var eng = cox.postposition.put('cat', '을');
  var num = cox.postposition.put('8', '을');

  console.log(kor); // 고양이를
  console.log(eng); // cat을 ('씨에이티를'이 아닌 '캣을'로 처리)
  console.log(num); // 8을
</script>
```


#### Details

```js
import postposition from 'cox-postposition';

// 종성이 있는지 여부 (종성이 있으면 true)
postposition.check('바다'); // false
postposition.check('하늘'); // true

// 로/으로에 대한 종성이 있는지 여부 ('ㄹ'은 종성이 없는 것으로 간주)
postposition.check('바다', '로'); // false
postposition.check('하늘', '로'); // false
postposition.check('구름', '로'); // true

// 입력한 단어에 따른 조사 반환 (이/가를 처리하려면 '이'나 '가'를 입력)
postposition.pick('고양이', '이'); // 가
postposition.pick('고양이', '가'); // 가
postposition.pick('<고양이>', '가'); // 가

// 입력한 단어에 조사 적용 (한글, 영어, 숫자에 대응)
postposition.put('cat', '을'); // cat을
postposition.put('cat', '를'); // cat을
postposition.put('[cat]', '를'); // [cat]을

// 은/는, 이/가, 을/를, 과/와, 나/이나, 로/으로 이외의 조사 처리 (종성이 없는 조건을 먼저 입력)
postposition.put('고양이', '야', '아'); // 고양이야
postposition.put('야옹', '야', '아'); // 야옹아

// 지정한 조사만 처리하는 함수 생성
const putEul = postposition.fix('을');
const putRang = postposition.fix('랑', '이랑');

putEul('바위'); // 바위를
putEul('rock'); // rock을
putRang('바위'); // 바위랑
putRang('rock'); // rock이랑
```

개별 메서드만 사용할 수도 있습니다.

```js
import { check, pick, put, fix } from 'cox-postposition';

// 종성이 있는지 여부
check('바다'); // false

// 입력한 단어에 따른 조사 반환
pick('고양이', '이'); // 가

// 입력한 단어에 조사 적용
put('cat', '을'); // cat을

// 지정한 조사만 처리 함수 생성
const putEul = fix('을');

putEul('바위'); // 바위를
```

## Method

### check( text[, type] )

> 종성이 있는지 여부를 체크합니다.

* `text`: [필수] 종성이 있는지를 체크할 단어
* `type`: [선택] 조사 타입('로/으로'인 경우 사용)
* `return`: 종성이 있는지 여부

조사가 `로/으로`가 아닌 경우는 `type` 파라미터를 생략해도 됩니다.

```js
// 종성이 없는 단어
postposition.check('바다'); // false
postposition.check('sea'); // false
postposition.check('2'); // false

// 종성이 있는 단어
postposition.check('필름'); // true
postposition.check('film'); // true
postposition.check('6'); // true
```

조사가 `로/으로`인 경우는 종성이 `ㄹ`이면 종성이 없는 것으로 간주합니다. 단 `로/으로` 조사 타입에 대한 결과를 반환하는 것이지 `로`나 `으로`에 대해서 파라미터와 비교한 결과를 반환하는 것이 아닙니다.

```js
// 종성이 'ㄹ'인 경우
postposition.check('가을', '로'); // false
postposition.check('feel', '로'); // false
postposition.check('7', '로'); // false
```

### pick( text, type[, special] )

> 단어에 맞는 조사를 반환합니다.

* `text`: [필수] 종성을 적용할 단어
* `type`: [필수] 조사 타입, 종성이 없을 때 조사
* `special`: [선택] 종성이 있을 때 조사
* `return`: 적용할 조사

다음 조사에 대해서는 `special` 파라미터를 생략하고, 종성 유무와 관계 없이 둘 중 하나만 입력하면 됩니다.

* 는/은
* 가/이
* 와/과
* 를/을
* 나/이나
* 로/으로

```js
// 종성이 없는 단어
postposition.pick('바다', '가'); // 가
postposition.pick('sea', '이'); // 가
postposition.pick('2', '가'); // 가

// 종성이 있는 단어
postposition.pick('필름', '가'); // 이
postposition.pick('film', '이'); // 이
postposition.pick('6', '가'); // 이

// 조사가 '로/으로'이고 종성이 'ㄹ'인 경우
postposition.pick('가을', '으로'); // 로
postposition.pick('feel', '로'); // 로
postposition.pick('8', '으로'); // 로
```

기본 조사에서 지원하지 않는 경우는 직접 지정할 수 있습니다. 종성이 없는 조건, 종성이 있는 조건 순으로 파라미터를 전달합니다.

```js
postposition.pick('바다', '야', '아'); // 야
postposition.pick('swimming', '랑', '이랑'); // 이랑
postposition.pick('1', '면', '이면'); // 이면
```

### put( text, type[, special] )

> 단어에 맞는 조사를 적용한 글자를 반환합니다.

* `text`: [필수] 종성을 적용할 단어
* `type`: [필수] 조사 타입, 종성이 없을 때 조사
* `special`: [선택] 종성이 있을 때 조사
* `return`: 단어에 조사를 적용한 글자

`pick` 메서드와 동일한 처리를 하지만 대상 글자에 조사를 적용한 글자가 반환됩니다.

```js
// 종성이 없는 단어
postposition.put('바다', '가'); // 바다가
postposition.put('sea', '이'); // sea가
postposition.put('2', '가'); // 2가
postposition.put('[9]', '이'); // [9]가

// 종성이 있는 단어
postposition.put('필름', '가'); // 필름이
postposition.put('film', '이'); // film이
postposition.put('6', '가'); // 6이
postposition.put('"7"', '이'); // "7"이

// 조사가 '로/으로'이고 종성이 'ㄹ'인 경우
postposition.put('가을', '으로'); // 가을로
postposition.put('feel', '로'); // feel로
postposition.put('7', '으로'); // 7로
postposition.put('(8)', '로'); // (8)로
```

`pick` 메서드와 동일하게 종성 여부에 따른 조사를 직접 지정할 수 있습니다.

```js
postposition.put('바다', '야', '아'); // 바다야
postposition.put('swimming', '랑', '이랑'); // swimming이랑
postposition.put('7', '면', '이면'); // 7이면
postposition.put('드림(dream)', '라서', '이라서'); // 드림(dream)이라서
```


### fix( type[, special] )

> 특정 조사를 처리하는 함수를 반환합니다.

* `type`: 조사 타입, 종성이 없을 때 조사
* `special`: [선택] 종성이 있을 때 조사
* `return`: 지정한 조사를 처리하는 함수 반환

특정 조사를 반복해서 처리하는 경우는 원하는 조사를 지정하여 함수를 생성할 수 있습니다.

```js
// 은/는을 처리하는 함수
const eun = postposition.fix('는');

// 을/를을 처리하는 함수
const eul = postposition.fix('를');

// 아/야를 처리하는 함수
const ya = postposition.fix('야', '아');


eun('구름'); // 구름은
eul('구름'); // 구름을
ya('구름'); // 구름아

```

## Guide

한글은 종성에 따라 조사가 결정되므로 종성 유무를 파악하여 조사를 구분하도록 처리하고 있습니다. 단, `로/으로`에 한해서 `ㄹ` 종성은 없는 것으로 예외처리합니다.

영문의 경우는 영어 발음을 기준으로 처리합니다. 단, 영문의 경우는 발음을 표기하는 방식에 규칙이 없기 때문에 흔한 상황 위주로 분류하고 특수한 사례를 개별 관리하고 있습니다.

```html
// me로 끝나는 단어
me -> me[미]는
some - some[썸]은

// oot로 끝나는 단어
root -> root[루트]를
foot -> foot[풋]을
```

한글의 영문 표기법에 따른 발음은 고려하지 않습니다.

```html
[Ji-sung Park] park -> park[파크]를, 팍(X)
[So Ji-sub] sub -> sub[서브]를, 섭(X)
```

숫자의 경우는 한글 발음을 기준으로 합니다.

```html
동물1 -> 동물1[일]을
animal3 -> animal3[삼]을, 쓰리(X)
```

## License
MIT
