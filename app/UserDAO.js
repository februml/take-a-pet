var UserDAO = function(){}

UserDAO.prototype.validate = function(userDict){
    if(!userDict.name || userDict.name.lenght == 0){
        throw 'No name provided';
    }else if(!userDict.phone || userDict.phone.lenght == 0){
        throw 'No phone provided';
    }else if(!userDict.email || userDict.email.lenght == 0){
        throw 'No email provided';
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