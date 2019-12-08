# Thermostats 

## Set 

The `Set` type implements usual operations:
+ cap
+ cup
+ diff
+ leq 
etc. 

Somehow relies on a total ordering on js objects, as reflected by array.sort()

## Nerve

The `Nerve` type class consists of union types formed by chains. 
The nerve type `N` should be constructed from a hypergraph `X : [Set]`. 
and relies on the following operations: 
+ `face : N -> N`
+ `cofaces : N -> [N]`
+ `cone : N -> [N]`
+ `cocone : N -> [N]`
+ `intercone : N -> [N]`
etc. 

## Functors and Cofunctors 

The `Functor X` type class describes covariant 
functors over an abstract category `X`, 
i.e. whose arrows are not represented by programs but for instance consist of 
order relationships. 

A functor instance `F` is a type constructor `F a` for every `a` of `X`, 
implementing the method: 
+ `func : (a > b) -> F a -> F b`

The `Cofunctor X` type class similarly represents contravariant functors 
over an abstract category `X`, 
equivalently a functor over the opposite category `X*`. 
Note that the dualising `X` to `X*` is an *abstract* reversing of arrows. 

A cofunctor `F` implements the method: 
+ `cofunc : (a > b) -> F b -> F a`

Given a type class `Y`, let us denote by: 
+ `{Y < X}` the class of functors over `X` valued in `Y`, 
+ `{Y <* X}` the class of cofunctors over `X` valued in `Y`,
the difference between `{Y < X*}` and `{Y <* X}` being purely syntactic,
as they implement `cofunc` and `func` respectively. 
This distinction will only be important when dealing with 
type constructors that are both functors and cofunctors, whose 
type we shall denote by `{Y <> X}`.

In practice we shall be interested with (co)functors of nd-arrays, 
where extension maps shall require shapes to be prescribed by a given 
projective system of sets `E`. 

## Configuration spaces

Assume given a type constructor `E_i` for all `i : I`, 
where each `E_i = [x_i, y_i, ...]` is the ordered union type 
describing possible values for coordinate `i`. 

It naturally defines a functor `E: {Set < P(I)}` 
by extended to `E` to any subset `a : P(I)` as the 
dependent product type: 
```
E_a = Prod_{i: a} E_i 
```
Which we implement as the record type with keys in `a`: 
```
E_a = { xi: E_i | i: a }
```

`E` defines a functor in `{Set < P(I)}` 
where the functorial map `E_a -> E_b` forgets the values `x_j` indexed 
by coordinates `j` that are not in `b`. 

*N.B.* If cells `a` and `b` where thought of as union types as they should, 
the inclusion `b leq a` would correspond to a program of type `b -> a`. 
Our choice of arrows is dual (sic) and should be thought of abstractly. 


## Algebras and Measure Spaces

Functions over the cartesian product `E_a = Prod_{i: a} E_i` 
are described by n-dimensional arrays with real or complex values, 
of shape `|E_i0| x ... x |E_in|` . 

This type constructor `F_a = R^{E_a}` follows an inductive procedure: 
``` 
R^{E x E'} = (R^E')^E 
``` 
reflecting the fact that coordinates are accessed sequentially, 
in contrast to a flattened array. 

Viewed as algebras, `R^E` defines a contravariant functor with respect 
to cylindrical extensions and: 
```
cofunc : (a > b) -> R^{E_b} -> R^{E_a} 
```
canonically extends arrays of shape `E_b` to arrays of shape `E_a`. 

Viewed as measures, `R^E` defines a covariant functor with respect
to the dual marginal projections: 
``` 
func : (a > b) -> R^{E_a} -> R^{E_b}
```

reduces an array of shape `E_a` to an array of shape `E_b`
by partial integration over the variables of `a - b`. 

Hence `R^E` belongs to the type classes `{Alg <* X}` and  `{Vect <> X}`.

## Complex 

The `Complex X` type class describes chain and cochain complexes 
over the nerve of X. 

Type instances should be constructed by extending a functor 
over `X` to its nerve `N = Nerve X`, for instance:  

```
A = Prod_{a: N} R^{ E_a } 
where
    a = a- > ... > a+
    E_a = Prod_{i: a+} E_i  
```

Type instance `A` is graded as the union type `Sum_{n: int} A[n]`, 
where each `A[n]` is represented as a record type of nd-arrays over `N[n]`: 

```
A[n] = { fa: R^{E_a} | a: N[n] }
```

Type instance `A` should implement the following methods:
+ `map : A -> A`
+ `diff : A[n] -> A[n+1]`
+ `div : A[n] -> A[n-1]`
+ `zeta : A -> A`
+ `mu : A -> A` 

*N.B.* We are here assuming given both a covariant and a contravariant functor.



# Remarks on Set Representation

For convenience, we chose a programmatic representation relying only on 
arrays, put in bijective correspondence with index strings: 
+ atoms: `'i'` identifies an atom by a string key
+ regions: `'i.j.k' <=> ['i', 'j', 'k']` 
identifies a region by ordered concatenation of atom keys, 
+ chains: `'i.j > j' <=> [['i','j'], ['j']]` 
identifies a region by ordered concatenation of region keys. 

Note the ambiguities:
+ between atom `'i'` and region `['i']`
+ between region `['i','j']` and 0-chain `[['i','j']]`

