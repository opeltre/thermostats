let Alg = require('./alg'),
    Sys = require('./system'),
    __ = require('./__');

let fmap = 
    F => u => 
        u.system.field(u.degree, u.values).map(F);

let sum = 
    (u, ...us) => us.length
        ? sum(...us).plus(u)
        : u.system.field(u.degree, u.values);

let diff = 
    u => __.range(u.degree + 2)
        .map(
            k => u.system.field(
                u.degree + 1,
                a => u.marginal(Sys.face(k)(a), a)
            ).scale((-1)**k)
        )
        .reduce((v,vk) => v.plus(vk));

let div = 
    u => __.range(u.degree + 1)
        .map(
            k => u.chains()
                .map(a => [a, Sys.face(k)(a)])
                .reduce(
                    (vk, [a, b]) => vk.add(b, u.get(a, b)),
                    u.system.field(u.degree - 1)
                )
                .scale((-1)**k)
        )
        .reduce((v, vk) => v.plus(vk));
            
let exp_ = Alg.map(u => Math.exp(-u)),
    _ln = Alg.map(q => - Math.log(q)),
    helmholtz = __.pipe(exp_, Alg.mass, _ln),
    reduce = H => Alg.map(h => h - helmholtz(H))(H);

let eff = 
    (a, b) => __.pipe(
        exp_,
        Alg.marginal(...[a, b].map(Sys.cell)),
        _ln
    );

let nabla = 
    U => U.system.nerve[1].reduce(
        (phi, [a, b]) => phi.set(
            [a, b], 
            eff([a], [b])(
                Alg.subt(U.get([b], [a]), U.get([a]))
            )
        ),
        U.system.field(1)
    );

let zeta = 
    u => u.system.nerve[1].reduce(
        (v, [a, b]) => v.add([a], u.get([b], [a])),
        u.system.field(0, u.values)
    );

let BP = 
    H => {
        let U = fmap(reduce)(H);
        let phi = nabla(U).scale(-1);
        let v = div(phi);
        return {
            U, phi, v,
            H: sum(U, zeta(v))
        };
    };

module.exports = Object.assign({}, {
    exp_ : fmap(exp_),
    _ln : fmap(_ln),
    reduce : fmap(reduce),
    helmholtz,
    fmap,
    sum,
    zeta, diff, div,
    eff, nabla,
    BP
});

