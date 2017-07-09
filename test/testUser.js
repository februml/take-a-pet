var expect = require("chai").expect;
var sinon = require("sinon");
var UserDAO = require("../app/UserDAO");

//const mongoDb = require('mongodb').Db;
//const mongoCollection = require('mongodb').Collection;

describe('User test', function(){
    var db; //db mock

    //executado antes de cada teste para zerar o mock do banco
    beforeEach(function(){
        db = {
            collection: function(col){return this},
            save: function(save){return this},
            findOne: function(dict){return this}
        };
    });

    var createUserDict = function(){
        return {
            name: "UserName",
            username: "username",
            pass: "password",
            age: "20",
            //phone: "51 33333333",
            email: "user@email.com",
            //region: "Zona",
            address: "123 john street"
        };
    }

    //database
    it('Should save the User on the database', function(){
        var collectionMock = sinon.spy(db, "collection");
        var saveMock = sinon.spy(db, "save");

        var dict = createUserDict();

        UserDAO.save(db, dict);

        sinon.assert.calledWith(collectionMock, "user");
        sinon.assert.calledWith(saveMock, dict);
    });

    it('Should call database loading with correct username parameters', function(){
        var collectionMock = sinon.spy(db, "collection");
        var findOneMock = sinon.spy(db, "findOne");
        
        var dict = {
            username: "username"
        }

        UserDAO.findUserByName(db, "username");   

        sinon.assert.calledWith(collectionMock, "user");
        sinon.assert.calledWith(findOneMock, dict);
    });

    //sucesso
    it('Should not trhow exception when validating with ALL required parameters', function(){
        let reqOpt = createUserDict();
        UserDAO.validate(reqOpt);  
    });

    //erros
    it('Should trhow exception when validating user if no age', function(){
        let reqOpt = createUserDict();
        delete reqOpt.age;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No age provided");  
    });

    it('Should trhow exception when validating user if no name', function(){
        let reqOpt = createUserDict();
        delete reqOpt.name;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No name provided");    
    });
    /*
    it('Should trhow exception when validating user if no phone', function(){
        let reqOpt = createUserDict();
        delete reqOpt.phone;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No phone provided");    
    });*/

    it('Should trhow exception when validating user if no email', function(){
        let reqOpt = createUserDict();
        delete reqOpt.email;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No email provided");    
    });
    /*
    it('Should trhow exception when validating user if no region', function(){
        let reqOpt = createUserDict();
        delete reqOpt.region;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No region provided");    
    });*/

    it('Should trhow exception when validating user if no address', function(){
        let reqOpt = createUserDict();
        delete reqOpt.address;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No address provided");    
    });

    it('Should trhow exception when validating user if no usernar', function(){
        let reqOpt = createUserDict();
        delete reqOpt.username;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No username provided");  
    });

    it('Should trhow exception when validating user if no password', function(){
        let reqOpt = createUserDict();
        delete reqOpt.pass;

        expect(function(){
            UserDAO.validate(reqOpt);        
        }).to.throw("No pass provided");  
    });
});