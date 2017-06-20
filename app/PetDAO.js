var PetDAO = function(){}

PetDAO.prototype.validate = function(userDict){
    if(!userDict.type || userDict.type.lenght == 0){
        //throw 'No type provided';
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

PetDAO.prototype.save = function(db, newPet){
     db.collection("user").findOne({
        username: newPet.username
    }, function(err, user){
        newPet.phone = user.phone;
        db.collection("pet").save(newPet, function(err){
            if(err){
                throw (err);
            }
        });
    });
}

PetDAO.prototype.findAll = function(db, callback){
    db.collection("pet").find({}).toArray(function(err, results){
        if(err){
            throw(err);
        }
        callback(results);
    });
}

module.exports = new PetDAO();