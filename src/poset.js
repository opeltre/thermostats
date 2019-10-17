let __ = require('@opeltre/math');

//---------------------------------------------------------------

//-------- logic --------

let S = {cell, chain};

let arrEq = 
    ([i, ...is], [j, ...js]) => S.eq(i, j)
        ? (is.length || js.length ? arrEq(is, js) : true)
        : false;

S.eq = 
    (a, b) => Array.isArray(a) && Array.isArray(b)
        ? arrEq(a, b)
        : a === b;

S.in = 
    (i, [j, ...js]) => typeof j !== 'undefined'
        ? (S.eq(i, j) ? true : S.in(i, js))
        : false;

S.cap = 
    (a, b) => a.filter(i => S.in(i, b));

S.cup = 
    (a, b, ord) => [...a, ...b.filter(j => !S.in(j, a))]
        .sort(ord);

S.diff = 
    (a, b) => a.filter(i => !S.in(i, b));

S.filter = 
    ([i, ...is], ord) => typeof i !== 'undefined' 
        ? S.cup(S.filter(is), [i], ord) 
        : [];

//-------- order ----------

S.leq = 
    (a, b) => S.eq(a, S.cap(a,b));

S.geq = 
    (a, b) => S.eq(S.cap(a,b), b);

S.sub = 
    (a, b) => S.leq(a, b) && !S.eq(a, b);

S.sup = 
    (a, b) => S.geq(a, b) && !S.eq(a, b);

// used ?
S.max = 
    as => as.filter(
        a => !as.filter(b => S.sub(a, b)).length
    );

//-------- sub-orders --------

S.cone = 
    a => bs => 
        bs.filter(b => S.geq(a, b));

S.intercone = 
    (a, c) => bs => 
        bs.filter(b => S.geq(a, b) && !S.geq(c, b));

S.interval = 
    (a, c) => bs => 
        bs.filter(b => S.geq(a, b) && S.geq(b, c));

let last = 
    arr => arr[arr.length - 1]

let nerve = 
    N => last(N).length
        ? nerve([
            ...N, 
            last(N)
                .map(
                    ch => N[0]
                        .filter(([a]) => S.sup(last(ch), a))
                        .map(([a]) => [...ch, a])
                )
                .reduce((xs, ys) => [...xs, ...ys])
        ])
        : N.slice(0, N.length - 1);

S.nerve = 
    as => nerve(as.map(a => [a]));

S.face = 
    k => ch => [...ch.slice(0, k), ...ch.slice(k + 1)];

S.closure = 
    as => as.length
        ? [ 
            ...as,
            ...S.closure(S.filter(
                as
                    .map(
                        (a, i) => as.slice(i+1).map(b => S.cap(a, b))
                    )
                    .reduce((xs, ys) => [...xs, ...ys])
                    .filter(c => ! S.in(c, as))
            ))
        ]
        : [];

module.exports = S;
