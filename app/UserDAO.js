var UserDAO = function(){}

UserDAO.prototype.validate = function(userDict){
    if(!userDict.name || userDict.name.lenght == 0){
        throw 'No name provided';
    /*}else if(!userDict.phone || userDict.phone.lenght == 0){
        throw 'No phone provided';*/
    }else if(!userDict.email || userDict.email.lenght == 0){
        throw 'No email provided';
    /*}else if(!userDict.region || userDict.region.lenght == 0){
        throw 'No region provided';*/
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

UserDAO.prototype.save = function(db, newUser, callback){
    db.collection("user").save(newUser, function(err){
        if(err){
            throw (err);
        }else{
            callback(newUser);
        }
    });
}

UserDAO.prototype.findUserByName = function(db, username, callback){
    db.collection("user").findOne({
        username: username
    }, function(err, user){
        if (err){
            callback (err);
        }else if (!user){
            callback(null);
        }else{
            callback(user);
        }
    });
}

UserDAO.prototype.findUserAndPetsByName = function(db, username, callback) {
    db.collection("user").aggregate([
        { $match: {
             username: username
            }
        },
        { $lookup:
            {
                from:"pet",
                localField:"username",
                foreignField:"username",
                as:"user_pets"
            }
        }
    ],
    function(err, user) {
        if (err){
            callback (err);
        }else if (!user){
            callback(null);
        }else{
            callback(user);
        }
    });
}

module.exports = new UserDAO();