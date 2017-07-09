var expect = require("chai").expect;
var sinon = require("sinon");

describe("Login tests", function(){
    var LoginDAO = require("../app/LoginDAO");
    var db; //db mock

    //executado antes de cada teste para zerar o mock do banco
    beforeEach(function(){
        db = {
            collection: function(col){return this},
            findOne: function(dict){return this}
        };
    });

    //Objeto dict dummy (simulando o objeto de request)
    var createLoginDict = function(){
        return {
            username: "username",
            pass: "senha"
        };
    }

    //database
    it('Should call database with the correct parameters', function(){
        //espiões
        var collectionMock = sinon.spy(db, "collection");
        var findOneMock = sinon.spy(db, "findOne");

        var dict = createLoginDict();

        LoginDAO.findUserByNameAndPass(db, dict);

        //verifica se o banco foi chamado corretamente
        sinon.assert.calledWith(collectionMock, "user");
        sinon.assert.calledWith(findOneMock, dict);
    });

    //sucesso
    it('Should not trhow exception when validating with ALL required parameters', function(){
        let reqOpt = createLoginDict();
        LoginDAO.validate(reqOpt);  
    });

    //errors
    it('Should trhow exception when validating user if NO username', function(){
        let reqOpt = createLoginDict();
        delete reqOpt.username;

        expect(function(){
            LoginDAO.validate(reqOpt);        
        }).to.throw("No username provided");  
    });

    it('Should trhow exception when validating user if NO password', function(){
        let reqOpt = createLoginDict();
        delete reqOpt.pass;

        expect(function(){
            LoginDAO.validate(reqOpt);        
        }).to.throw("No password provided");  
    });
});

