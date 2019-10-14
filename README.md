# thermostats

Should implement: 
+ posets with nerve
+ Dirichlet convolution
+ Systems of sets, rings, etc.  

## Poset

### Scope

An implementation of the powerset `P(I)` with 
its partial order and lattice structure. 

Any subset `X` of `P(I)` inherits the partial order structure,
`X` shall often be a semi-lattice for intersection. 

As partial order `X` is a category and its nerve `N(X)` is a simplicial object. 

### Representation

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


### Operations

Order relationships:
+ eq
+ leq
+ geq
+ sub
+ sup

Lattice and complements:
+ cap
+ cup
+ diff

Poset and subposets
+ closure
+ cone
+ intercone
+ interval

Simplicial object
+ nerve
