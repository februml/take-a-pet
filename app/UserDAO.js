var UserDAO = function(){}

UserDAO.prototype.validate = function(userDict){
    if(!userDict.name || userDict.name.lenght == 0){
        throw 'No name provided';
    }else if(!userDict.phone || userDict.phone.lenght == 0){
        throw 'No phone provided';
    }else if(!userDict.email || userDict.email.lenght == 0){
        throw 'No email provided';
    }else if(!userDict.region || userDict.region.lenght == 0){
        throw 'No region provided';
    }else if(!userDict.age || userDict.age.lenght == 0){
        throw 'No age provided';
    }else if(!userDict.username || userDict.username.lenght == 0){
        throw 'No username provided';
    }else if(!userDict.pass || userDict.pass.lenght == 0){
        throw 'No pass provided';
    }else if(!userDict.address || userDict.address.lenght == 0){
        throw 'No address provided';
    }
}

UserDAO.prototype.save = function(db, newUser){
    db.collection("user").save(newUser, function(err){
        if(err){
            throw (err);
        }
    });
}
module.exports = new UserDAO();