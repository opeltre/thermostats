let __ = require('@opeltre/math');

/* keys:
    let is =    [ 'i', 'j', 'k' ],
        as =    [ 'i.j', 'j.k', 'i.k' ],
        chs =   [ 'i.j > i', 'i.j > j', ... ]
*/

let key = is => 
    Array.isArray(is) ? is.join('.') : is;

let id = as => 
    !Array.isArray(as) ? as : as.map(key).join(' > ');

let region = is => 
    Array.isArray(is) ? is : is.split('.').filter(s => s !== '');

let chain = as => 
    (Array.isArray(as) ? as : as.split(' > ')).map(region);
    
let cell = __.pipe(
    id,
    chain, 
    ch => ch[ch.length -1]
);

let S = {id, chain, region, key, cell};

S.cap = 
    (a, b) => a.filter(i => b.indexOf(i) >= 0)

S.eq = 
    (a, b) => a.length === b.length 
        && ! a.filter((_,i) => a[i] !== b[i]).length;

S.leq = 
    (a, b) => S.eq(a, S.cap(a,b));
S.geq = 
    (a, b) => S.eq(S.cap(a,b), b);
S.sub = 
    (a, b) => S.leq(a, b) && !S.eq(a, b);
S.sup = 
    (a, b) => S.geq(a, b) && !S.eq(a, b);

S.max = 
    as => as.filter(
        a => !as.filter(b => S.sub(a, b)).length
    );

S.contains = 
    (as, b) => as.filter(a => S.eq(a, b)).length > 0;

S.append = 
    (as, b) => S.contains(as, b)
        ? as
        : [...as, b];

S.concat = 
    (as, bs) => bs.reduce(
        (cs, b) => S.append(cs, b),
        S.filter(as)
    );

S.remove = 
    (as, bs) => as.filter(a => !S.contains(bs, a));

S.filter = 
    ([a, ...as]) => a 
        ? S.append(S.filter(as), a) 
        : [];

S.cone = 
    a => bs => bs.filter(b => S.sup(a, b));

S.cones = 
    as => __.toKeys(
        as.map(a => [S.cone(a)(as), key(a)])
    );

let prolong = 
    (chains, cones) => chains
        .map(ch => cones[key(cell(ch))].map(b => [...ch, b]))
        .reduce((xs, ys) => [...xs, ...ys]);

S.prolong = prolong;

let last = 
    arr => arr[arr.length - 1]

let nerve = 
    (N, cones) => last(N).length
        ? nerve([...N, prolong(last(N), cones)], cones)
        : N.slice(0, N.length - 1);

S.nerve = __.pipe(
    __.map(region),
    X => nerve([X.map(a => [a])], S.cones(X))
);

S.pairs = 
    as => as
        .map(a => as
            .filter(b => S.sup(a, b))
            .map(b => [a, b])
        )
        .reduce((xs, ys) => [...xs, ...ys], []);

S.face = 
    i => __.pipe(
        chain,
        ch => [...ch.slice(0, i), ...ch.slice(i+1)]
    );

S.closure = 
    as => as.length
        ? [
            ...S.filter(as),
            ...S.closure(as
                .map((a,i) => as
                    .slice(0,i)
                    .map(b => S.cap(a, b))
                )
                .reduce(S.concat)
                .filter(c => !S.contains(as, c))
            )
        ]
        : [];

module.exports = S;
