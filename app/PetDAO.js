var PetDAO = function(){}
var mongo = require('mongodb');

PetDAO.prototype.validate = function(userDict){
    if(!userDict.type || userDict.type.lenght == 0){
        throw 'No type provided';
    }else if(!userDict.sex || userDict.sex.lenght == 0){
        throw 'No sex provided';
    }else if(!userDict.size || userDict.size.lenght == 0){
        throw 'No size provided';
    }else if(!userDict.age || userDict.age.lenght == 0){
        throw 'No age provided';
    }else if(!userDict.help || userDict.help.lenght == 0){
        throw 'No help provided';
    }else if(!userDict.date || userDict.date.lenght == 0){
        throw 'No date provided';
    }else if(!userDict.address || userDict.address.lenght == 0){
        throw 'No address provided';
    /*}else if(!userDict.region || userDict.region.lenght == 0){
        throw 'No region provided';*/
    }else if(!userDict.username || userDict.username.lenght == 0){
        throw 'No username on creating pet';
    }
}

PetDAO.prototype.save = function(db, newPet, user){
    newPet.phone = user.phone;
    newPet.email = user.email;
    db.collection("pet").save(newPet, function(err){
        if(err){
            throw (err);
        }
    });
}

PetDAO.prototype.findAll = function(db, callback){
    db.collection("pet").find({}, {_id: 1, picture: 1}).sort({_id:-1}).toArray(function(err, results){
        if(err){
            throw(err);
        }
        callback(results);
    });
}

PetDAO.prototype.findRecent = function(db, callback){
    db.collection("pet").find().sort({_id:-1}).limit(6).toArray(function(err, results){
        if(err){
            throw(err);
        }
        callback(results);
    });
}

//find().sort({_id:-1}).limit(2).pretty()

// carrega um pet de acordo com o id recebido
PetDAO.prototype.findByID = function(db, petId, callback) {
    var o_id = new mongo.ObjectID(petId);
    db.collection("pet").findOne({_id:o_id}, function(err, result) {
        if(err) {
            throw(err);
        }

        callback(result);
    });
}

module.exports = new PetDAO();