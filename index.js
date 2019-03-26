let alg = require('./alg'),
    sys = require('./system'),
    field = require('./field'),
    func = require('./func'),
    __ = require('./__');

let tmst = Object.assign(
    {alg},
    {sys},
    field,
    func
);

module.exports = tmst;
