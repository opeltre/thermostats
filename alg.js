let Sys = require('./system'),
    __ = require('./__');

let Alg = {};

Alg.map = f => 
    p => Array.isArray(p)
        ? p.map(Alg.map(f))
        : f(p);

Alg.add = 
    (p, q) => Array.isArray(p)
        ? p.map((_, i) => Alg.add(p[i], q[i]))
        : p + q;

Alg.mult = 
    (p, q) => Array.isArray(p)
        ? p.map((_, i) => Alg.mult(p[i], q[i]))
        : p * q;

Alg.scale = 
    z => Alg.map(y => z * y);

Alg.subt = 
    (p, q) => Alg.add(p, Alg.scale(-1)(q));

Alg.mass = 
    q => Array.isArray(q) 
        ? Alg.mass(q.reduce((x,y) => Alg.add(x,y)))
        : q;

let marginal = 
    ([i, ...is], [j, ...js]) => 
        q => typeof(i) === 'undefined'
            ? q
            : ( i === j 
                ? __.map(Alg.marginal(is, js))(q)
                : Alg.marginal(is, [j, ...js])(q.reduce(Alg.add))
            );

Alg.marginal = 
    (a, b) => marginal(...[a, b].map(Sys.region));

let extend = 
    ([i, ...is], [j, ...js], [E, ...Es]) => 
        q => typeof i === 'undefined' 
            ? q 
            : (i === j 
                ? q.map(Alg.extend(is, js, Es))
                : E.map(
                    _ => Alg.extend(is, [j, ...js], Es)(q)
                )
            );

Alg.extend = 
    (a, b, Es) => extend(...[a, b].map(Sys.region), Es);

/* lambda */

Alg.proj = (a, b) => 
    x => b
        .map(i => a.indexOf(i))
        .map(j => x[j]);


Alg.ext = (a, b) =>
    f => (...xs) => f(...Alg.proj(a, b)(xs));

/* array <--> lambda */

Alg.compute = (E, ...Es) => 
    f => typeof(E) === 'undefined'
        ? f()
        : E.map(
            x => Alg.compute(...Es)((...xs) => f(x, ...xs))
        );

Alg.call = q => 
    (i, ...is) => typeof(i) === 'undefined'
        ? q
        : Alg.call(q[i])(...is)

Alg.shape = 
    q => Array.isArray(q)
        ? [q.length, ...Alg.shape(q[0])]
        : [];

/* prob */

Alg.Gibbs = H => {
    let Q = Alg.map(h => Math.exp(-h))(H),
        Z = Alg.mass(Q);
    return Alg.map(q => q / Z)(Q);
}

Alg.expect = (a,b) => f =>
    p => Alg.mult(
        Alg.marginal(a,b)(Alg.mult(f,p)),
        Alg.map(y => 1 / y)(Alg.marginal(a,b)(p))
    );

/* exports */
module.exports = Alg;

