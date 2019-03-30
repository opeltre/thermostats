let tmst = require('./index'),
    __ = require('./__');

let B = 0.1,
    J = -1,
    h_i = x => B * x,
    h_ij = (x, y) => - J * x * y;

let I = ['a','b','c'],
    E = {
        a : [-1, 1],
        b : [-1, 1],
        c : [-1, 1]
    },
    A = [
        ['a', 'b'],
        ['b', 'c'],
        ['a', 'c']
    ],
    X = tmst.sys.closure([...A, ...I.map(i => [i])]),
    S = tmst.system(X, E);

// potential field
let h = S.field();
I.forEach(
    i => h.set(i, h_i)
);
A.forEach(
    a => h.set([a], h_ij)
);


// local hamiltonian field
let H = tmst.zeta(h);


// heat flux 
let phi = tmst.nabla(H);


// BP
let orbit = n => {
    let orb = [tmst.BP(H)]
    __.range(n).forEach(
        _ => orb.push(tmst.BP(orb[orb.length - 1].H))
    );
    return orb;
};

module.exports = {S, h, H, phi, orbit};
