let tm = require('../index'),
    __ = require('@opeltre/math');

let I = ['i', 'j', 'k'],
    E = {
        i : [-1, 1],
        j : [-1, 1],
        k : [-1, 1]
    },
    A = [
        ['i', 'j'],
        ['j', 'k'],
        ['i', 'k']
    ],
    X = tm.sys.closure([...A, ...I.map(i => [i])]),
    S = tm.system(X, E);


let ising = 

    (J=1, B=0) => {

        let h_i = x => B * x,
            h_ij = (x, y) => -J * x * y;

        let h = S.field();
        I.forEach(
            i => h.set(i, __(h_i))
        );
        A.forEach(
            a => h.set([a], __(h_ij))
        );

        return h;
    };

module.exports = {
    S,
    ising
};
