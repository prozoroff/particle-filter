# Particle Filter

Non linear filter for noisy and partial observations

> 

## Installation

```sh
npm install particle-filter --save
```

## Usage

```js
var particleFilter = require('particle-filter')

var filter = new particleFilter(particlesNumber, variablesNumber, distributionSize);

filter.update(measurements);

var result = filter.result;
```

## License

MIT license

[npm-image]: https://img.shields.io/npm/v/particle-filter.svg?style=flat
[npm-url]: https://npmjs.org/package/particle-filter
[downloads-image]: https://img.shields.io/npm/dm/particle-filter.svg?style=flat
[downloads-url]: https://npmjs.org/package/particle-filter
[travis-image]: https://img.shields.io/travis/prozorov/particle-filter.svg?style=flat
[travis-url]: https://travis-ci.org/prozorov/particle-filter
[coveralls-image]: https://img.shields.io/coveralls/prozorov/particle-filter.svg?style=flat
[coveralls-url]: https://coveralls.io/r/prozorov/particle-filter?branch=master
