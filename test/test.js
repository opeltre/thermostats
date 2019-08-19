let __ = require('@opeltre/math'),
    tm = require('../index'),
    fs = require('fs'),
    {S, ising} = require('./triangle');

let R = __.R,
    C = __.C,
    F = C.fourier;

let cell = 
    js => Array.isArray(js)
        ? js
        : js.split('.').filter(j => j !== '');

let extend =
    ([i, ...is], [j, ...js]) => 
        ([k, ...ks]) => typeof i === 'undefined'
            ? []
            : (i === j
                ? [k, ...extend(is, js)(ks)]
                : [0, ...extend(is, [j, ...js])([k, ...ks])]
            );

let mode = (b, kb) => 
    h => {

        let g = tm.fmap(F)(h);

        let as = g.chains()
            .map(([a]) => a)
            .filter(a => tm.sys.geq(a, b));

        let k = a => extend(a, b)(kb),
            gk = a => R.eval(k(a))(g.get([a]));

        return __.toKeys(as.map(a => [gk(a), tm.sys.key(a)]));
    }

exports.extend = 
    (...as) => extend(...as.map(tm.sys.region));

exports.mode = 
    (b, kb) => mode(tm.sys.region(b), kb);

/*** iterate BP ***/ 

let flow = (n, dt) => 
    tm.flow(n, u => tm.Dh(u).scale(dt));

exports.flow = flow;

exports.ising = ising;

let modes = b => 
    fs => { 
        let gs = fs.map(f => mode(b, b.map(_ => 1))(f));
        return __.mapKeys((ga, a) => gs.map(g => g[a]))(gs[0]);
    };

exports.modes = b => modes(cell(b));

let traces = ({J, B, n, dt, mode}) => {

    let fs = flow(n, dt)(ising(J, B)),
        gs = exports.modes(mode || '')(fs);

    let trace = (gb, b) => ({
        name: b,
        x: __.range(n).map(x => x * dt),
        y: gb.map(C.Re),
        mode: 'lines'
    });

    return __.pipe(
        __.mapKeys(trace),
        __.toPairs,
        ts => ts.map(([t, b]) => t)
    )(gs);
};

exports.traces = traces;
