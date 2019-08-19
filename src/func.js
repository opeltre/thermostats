let __ = require('@opeltre/math'),
    Alg = __.R,
    Sys = require('./system');

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
    _lnp = H => Alg.map(h => h - helmholtz(H))(H),
    gibbs = H => exp_(_lnp(H));

let eff = 
    (a, b) => __.pipe(
        exp_,
        Alg.marginal(...[a, b].map(Sys.cell)),
        _ln
    );

let Deff = 
    U => U.system.nerve[1].reduce(
        (phi, [a, b]) => phi.set(
            [a, b], 
            eff([a], [b])(
                Alg.subt(U.get([b], [a]), U.get([a]))
            )
        ),
        U.system.field(1)
    );

let _Deff = U => Deff(U).scale(-1);

let Zeta = 
    u => u.system.field(
        u.degree,
        a => u.system.zetaChains(a)            
            .map(b => u.get(b, a))
            .reduce(Alg.add)
    );
            
let zeta = 
    u => u.system.nerve[1].reduce(
        (v, [a, b]) => v.add([a], u.get([b], [a])),
        u.system.field(0, u.values)
    );

// let moebius = 

let Dh = __.pipe(zeta, _Deff, div);

let phi = __.pipe(zeta, _Deff);

let DH = __.pipe(_Deff, div, zeta); 


let flow = (n, d) => 
    x => {
        let xs = [x];
        for (i=0; i<n; i++) {
            let x = xs[xs.length - 1];
            xs.push( sum(x, d(x)) );
        };
        return xs;
    }

module.exports = Object.assign({}, {
    fmap,
    diff, 
    div,
    sum,
    zeta,     
    Zeta,
    exp_ : fmap(exp_),
    _ln : fmap(_ln),
    _lnp : fmap(_lnp),
    helmholtz,
    gibbs,
    eff, 
    Deff,
    Dh,
    DH,
    phi,
    flow
});

