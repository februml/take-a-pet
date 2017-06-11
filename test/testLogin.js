var expect = require("chai").expect;
var sinon = require("sinon");
var LoginDAO = require("../app/LoginDAO");

var createLoginDict = function(){
    return {
        username: "username",
        pass: "senha"
    };
}

//sucesso
it('Should not trhow exception', function(){
    let reqOpt = createLoginDict();
    LoginDAO.validate(reqOpt);  
});

//errors
it('Should trhow exception when validating user if no username', function(){
    let reqOpt = createLoginDict();
    delete reqOpt.username;

    expect(function(){
        LoginDAO.validate(reqOpt);        
    }).to.throw("No username provided");  
});

it('Should trhow exception when validating user if no password', function(){
    let reqOpt = createLoginDict();
    delete reqOpt.pass;

    expect(function(){
        LoginDAO.validate(reqOpt);        
    }).to.throw("No password provided");  
});