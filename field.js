let Sys = require('./system'),
    Alg = require('./alg'),
    __ = require('./__');

let {id, chain, cell} = Sys;

function system (X, E) {

    let my = {
        nerve: Sys.nerve(X) 
    };

    my.set = a => 
        cell(a).map(i => E[i]);

    my.extend = (a,b) => 
        Alg.extend(cell(a), cell(b), my.set(a));

    my.field = (deg, val) => 
        field(my, deg, val);

    return my;
}

function field (system, degree=0, values={}) {

    let my = {
        system :    system,
        chains :    _ => system.nerve[degree],
        degree :    degree,
        values :    {}
    };

    my.get = 
        (b, a) => (a ? my.system.extend(a, b) : fb => fb)(
            my.values[id(b)]
        );

    my.marginal = 
        (a, b) => Alg.marginal(...[a,b].map(cell))(my.get(a))

    my.set = 
        (a, fa) => {
            my.values[id(a)] = typeof fa === 'function'
                ? Alg.compute(system.set(a))(fa)
                : fa;
            return my;
        };

    my.add = 
        (a, fa) => my.set(a, Alg.add(my.get(a), fa));

    my.map =  
        F => {
            __.forKeys(
                (fa, a) => my.set(a, F(fa, a))
            )(my.values);
            return my;
        }

    my.scale = 
        t => my.map(Alg.scale(t));

    my.plus = 
        v => my.map(
            (fa, a) => Alg.add(fa, v.get(a))
        );

    my.minus = 
        v => my.plus(v.scale(-1));
    
    my.mult =
        v => my.map(
            (fa, a) => Alg.mult(fa, v.get(a))
        );

    let getval = 
        a => typeof values === 'function' 
            ? values(a) 
            : ( values[id(a)] || (_ => 0) );

    system.nerve[degree].forEach(
        (a) => my.set(a, getval(a)) 
    );

    return my;
}

module.exports = {
    system,
    field
};

