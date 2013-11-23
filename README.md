[![NPM version](https://badge.fury.io/js/jsmd.png)](http://badge.fury.io/js/jsmd)
[![Build Status](https://secure.travis-ci.org/vesln/jsmd.png)](http://travis-ci.org/vesln/jsmd)
[![Coverage Status](https://coveralls.io/repos/vesln/jsmd/badge.png?branch=master)](https://coveralls.io/r/vesln/jsmd?branch=master)
[![Code Climate](https://codeclimate.com/github/vesln/jsmd.png)](https://codeclimate.com/github/vesln/jsmd)

# jsmd

## Synopsis

jsmd ensures that you will never have outdated and non-working code in your
README files.

## Usage

```
Usage: jsmd <path>

Options:

  --debug     do not delete the temporary file after execution
  --help      display this help message
  --version   display the version number
```

### How to use it

Just write your README files in GitHub Flavored Markdown as usual. The only thing that you have
to add is the actual assertions. So here is a small example that will hopefully
illustrate how assertions look:

```js
var fs = require('fs');

fs.unlink('/tmp/this-is-stupid', function(err) {
  typeof err; // => 'object'
});
```

In this simple example we expect that the type of `err` is equal to 'object'.
As simple as that.

In order to verify if everything works properly just supply the desired file to
jsmd and it will verify it for you:

```
$ jsmd README.md
```

In order jsmd to recognize your JavaScript code elements, you have to specify
them either as "js" or "javascript".

See the [examples](https://github.com/vesln/jsmd/tree/master/examples) for more
info.

#### Hidden setup

Sometimes you don't want to put helper code into your readme file, but it's
necessary in order to perform the tests. In this case, you can simply add
special html comments which jsmd will extract and put inside the compiled file.

```
<!-- js
var server = require('express');
server();
-->
```

That way, GitHub won't visualize the comment but jsmd will be able to parse it.

### How it works

jsmd has very simple flow, that looks like this:

* First jsmd will parse and extract all JavaScript code elements
* It will search the code snippets for "assertions". Assertions look like
  this `Math.min(1, 2) // => 1`
* It will compile the JavaScript code with the assertions and it will try to
  execute it
* It will report failures if any

## Installation

```bash
$ npm install jsmd -g
```

## Tests

### Running the tests

```bash
$ npm test
```

### Test coverage

```bash
$ npm run-script coverage
```

## Credits

Special thanks to:

* [Jake Rosoman](https://github.com/jkroso)

## Related projects

* [Doctest.js](http://doctestjs.org/)
* [xplain](https://github.com/bahmutov/xplain) - JavaScript API documentation generator that uses unit tests as examples

## License

(The MIT License)

Copyright (c) 2013 Veselin Todorov <hi@vesln.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
