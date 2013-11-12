# fs

File I/O is provided by simple wrappers around standard POSIX functions. To use this module do require('fs'). All the methods have asynchronous and synchronous forms.

The asynchronous form always take a completion callback as its last argument. The arguments passed to the completion callback depend on the method, but the first argument is always reserved for an exception. If the operation was completed successfully, then the first argument will be null or undefined.

When using the synchronous form any exceptions are immediately thrown. You can use try/catch to handle exceptions or allow them to bubble up.

## Async

## Source

```js
var fs = require('fs');

fs.unlink('/tmp/this-is-stupid', function(err) {
  typeof err; // => 'object'
});
```

http://nodejs.org/api/fs.html
