let tmst = require('./index'),
    __ = require('./__');

let B = 0.1,
    J = 1,
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
        ['b', 'c']
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
let orbit = [tmst.BP(H)]
__.range(6).forEach(
    _ => orbit.push(tmst.BP(orbit[__.log(orbit.length - 1)].H))
);

/*
orbit.forEach(
    (D, i) => {
        __.logs('phi['+i+']: ')(D.phi.values)
        __.logs('U['+i+']: ')(D.U.values)
    //    __.logs('v['+i+']: ')(D.v.values)
        __.log('\n -- \n')
    }
);
*/

module.exports = {S, h, H, phi, orbit};
