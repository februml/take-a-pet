var expect = require("chai").expect;
var sinon = require("sinon");
var PetDAO = require("../app/PetDAO");

describe("Pet test", function(){
    var db;

    beforeEach(function(){
        db = {
            collection: function(col){return this},
            findOne: function(dict){return this},
            save: function(dict){return this},
            find: function(dict, orderDict){return this},
            sort: function(orderDict){return this},
            limit: function(size){return this},
            toArray: function(){return this}
        }
    });

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

    //database
    it('Should save the Pet on the database', function(){
        var collectionMock = sinon.spy(db, "collection");
        var saveMock = sinon.spy(db, "save");

        var dict = createPetDict();
        var userDict = {
            phone: "999999999",
            email: "email@email.com"
        }

        PetDAO.save(db, dict, userDict);

        sinon.assert.calledWith(collectionMock, "pet");
        sinon.assert.calledWith(saveMock, dict);
    });

    it('Should call the database loading all pets', function(){
        var collectionMock = sinon.spy(db, "collection");
        var findMock = sinon.spy(db, "find");

        PetDAO.findAll(db);

        sinon.assert.calledWith(collectionMock, "pet");
        sinon.assert.calledWith(findMock, {}, {_id: 1});
    });

    it('Should call the database loading the 6 most recent pets', function(){
        var collectionMock = sinon.spy(db, "collection");
        var findMock = sinon.spy(db, "find");
        var sortMock = sinon.spy(db, "sort");
        var limitMock = sinon.spy(db, "limit");

        PetDAO.findRecent(db);

        sinon.assert.calledWith(collectionMock, "pet");
        sinon.assert.calledOnce(findMock);
        sinon.assert.calledWith(sortMock, {_id:-1});
        sinon.assert.calledWith(limitMock, 6);
    });


    it('Should call database loading with correct ID', function(){
        var collectionMock = sinon.spy(db, "collection");
        var findOneMock = sinon.spy(db, "findOne");

        var dict = createPetDict();

        PetDAO.findRecent(db);

        sinon.assert.calledWith(collectionMock, "pet");
    });

    //sucesso
    it('Should not trhow exception when validating with ALL required parameters', function(){
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
});