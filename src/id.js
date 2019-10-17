let id = {};

// cell keys 

id.toCell = 
    is => Array.isArray(is) 
        ? is 
        : is.split('.').filter(s => s!== '');

id.fromCell =  
    is => Array.isArray(is) 
        ? is.join('.') 
        : is;


// chain keys 

id.toChain
    as => Array.isArray(as) 
        ? as 
        : as.split(' > ')).map(id.toCell);

id.fromChain =
    as => Array.isArray(as) 
        ? as.map(key).join(' > ') 
        : as;

id.chainCell = 
    __.pipe(id.toChain, ch => ch[ch.length - 1]);

