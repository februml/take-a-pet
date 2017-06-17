var expect = require("chai").expect;
var sinon = require("sinon");
var PetDAO = require("../app/PetDAO");

var createPetDict = function(){
    //just necessary fields
    return {
        type: "E_C", //espécie
        sex: "Ma",
        size: "Gr",
        age: "Adulto",
        help: "Adocao",
        date: "15/01/2016",
        //region: "ZS",
        address: "rua x, numero 123",
        username: "username"
    };
}
//sucesso
it('Should not trhow exception', function(){
    let reqOpt = createPetDict();
    PetDAO.validate(reqOpt);        
});

//errors
it('Should trhow exception when validating user if no type', function(){
    let reqOpt = createPetDict();
    delete reqOpt.type;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No type provided");  
});

it('Should trhow exception when validating user if no sex', function(){
    let reqOpt = createPetDict();
    delete reqOpt.sex;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No sex provided");  
});

it('Should trhow exception when validating user if no size', function(){
    let reqOpt = createPetDict();
    delete reqOpt.size;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No size provided");  
});

it('Should trhow exception when validating user if no age', function(){
    let reqOpt = createPetDict();
    delete reqOpt.age;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No age provided");  
});

it('Should trhow exception when validating user if no help', function(){
    let reqOpt = createPetDict();
    delete reqOpt.help;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No help provided");  
});

it('Should trhow exception when validating user if no date', function(){
    let reqOpt = createPetDict();
    delete reqOpt.date;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No date provided");  
});
/*
it('Should trhow exception when validating user if no region', function(){
    let reqOpt = createPetDict();
    delete reqOpt.region;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No region provided");  
});*/

it('Should trhow exception when validating user if no address', function(){
    let reqOpt = createPetDict();
    delete reqOpt.address;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No address provided");  
});

it('Should trhow exception when dont have username when creating pet', function(){
    let reqOpt = createPetDict();
    delete reqOpt.username;

    expect(function(){
        PetDAO.validate(reqOpt);        
    }).to.throw("No username");  
});

