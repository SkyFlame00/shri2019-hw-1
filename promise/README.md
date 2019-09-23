# Promise polyfill
## Что реализовано
Реализованы самые базовые возможности промисов:
- resolve, reject
- чейнинг через then
- разрешение вложенных промисов

Не реализована возможность продолжения чейнинга через then после обработки ошибки.

## Примеры использования

```js
var p = new Promise(function(resolve) {
  setTimeout(() => {
    resolve(15);
  }, 1000);
});

p.then(function(val) {
  console.log(val); // 15
});
```

```js
new Promise(function(resolve) {
  resolve('Hello')
}).then(function(str) {
  if (str !== 'hello')
    throw new Error('Is not "hello"');
}).then(
  function() {},
  function(e) {
    console.log(e.message); // Is not "hello"
  }
)
```

```js
var p = new Promise(function(resolve) {
  resolve(1)
});

p.then(function(n) {
  return new Promise(function(resolve) {
    resolve(n * 10);
  });
}).then(function(n) {
  console.log(n); // 10
});
```