let Alg = require('./alg');

let C = Alg.mapN(
    (x, y) => ({
        Re: x,
        Im: y || 0
    })
);

C.i = C(0,1);

let Re = z => z.Re,
    Im = z => z.Im;

C.Re = Alg.map(Re);
C.Im = Alg.map(Im);

let bar = 
    z => C(Re(z), -Im(z));

C.bar = Alg.map(bar);

let add = 
    (a, b) => C(
        Re(a) + Re(b),
        Im(a) + Im(b)
    );

C.add = Alg.mapN(add);
        
let mult = 
    (a, b) => C(
        Re(a) * Re(b) - Im(a) * Im(b),
        Re(a) * Im(b) + Im(a) * Re(b)
    );

C.mult = Alg.mapN(mult);

C.scalar = 
    (a, b) => Alg.mass(
        C.mult(C.bar(a), b)
    );

C.scale = 
    t => Alg.map(z => mult(t, z));

let abs = 
    z => Math.sqrt(Re(z)**2 + Im(z)**2);

C.abs = Alg.map(abs);

let sign = t => Math.sign(t) || 1;

let phase = 
    z => Re(z) === 0 
        ? Math.sign(Im(z)) * (Math.PI / 2)
        : Math.atan(Im(z)/Re(z)) - (Re(z) > 0 ? 0 : sign(Im(z)) * Math.PI);

C.phase = Alg.map(phase);

C.expi = 
    t => C(Math.cos(t), Math.sin(t));

C.exp = 
    z => C.mult(
        C(Math.exp(Re(z))), 
        C.expi(Im(z))
    );

module.exports = C;
