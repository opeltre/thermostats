let sys = require('./src/system'),
    field = require('./src/field'),
    func = require('./src/func');

let tmst = Object.assign(
    {sys},
    field,
    func
);

module.exports = tmst;
