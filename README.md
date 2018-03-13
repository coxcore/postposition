# cox.postposition
> 종성 여부에 따라 글자 뒤에 붙는 한글 조사를 처리하는 javascript library입니다.
>
> 국어, 숫자, 영어에 대한 한글 조사를 선택하거나 적용합니다. 단, 영어는 발음이 특수한 경우에 대해서 100% 지원하지 않습니다.

## Demo

[예제 보기](https://cdn.rawgit.com/coxcore/postposition/0.0.0/demo/index.html)

## Installation

### NPM
```
$ npm install cox-postposition
```

### CDN
```
https://cdn.rawgit.com/coxcore/postposition/0.0.0/dist/cox.postposition.min.js
```

### DOWNLOAD
- [Releases](https://github.com/coxcore/postposition/releases)

## Usage

### Module
```js
import postposition from 'cox-postposition';

const kor = postposition.put('고양이', '을');
const eng = postposition.put('cat', '을');
const num = postposition.put('8', '을');

console.log(kor); // 고양이를
console.log(eng); // cat을 ('씨에이티를'이 아닌 '캣을'로 처리)
console.log(eng); // 8을
```

### UMD
IE8 이하는 지원하지 않습니다.

```html
<script src="https://cdn.rawgit.com/coxcore/postposition/0.0.0/dist/cox.postposition.min.js"></script>

<script>
  var kor = cox.postposition.put('고양이', '을');
  var eng = cox.postposition.put('cat', '을');
  var num = cox.postposition.put('8', '을');

  console.log(kor); // 고양이를
  console.log(eng); // cat을 ('씨에이티를'이 아닌 '캣을'로 처리)
  console.log(eng); // 8을
</script>
```

기본 `put` 메서드 외에 사용법은 아래와 같습니다.


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

### pick( text[, type, special] )

> 단어에 맞는 조사를 반환합니다.

* `text`: [필수] 종성을 적용할 단어
* `type`: [선택] 조사 타입, 종성이 없을 때 조사
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

### put( text[, type, special] )

> 단어에 맞는 조사를 적용한 글자를 반환합니다.

* `text`: [필수] 종성을 적용할 단어
* `type`: [선택] 조사 타입, 종성이 없을 때 조사
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

## License
MIT
