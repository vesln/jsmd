```js
var gen = function*(){yield 1}
gen().next() // => {value:1,done:false}
```