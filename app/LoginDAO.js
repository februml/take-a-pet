var LoginDAO = function(){}

LoginDAO.prototype.validate = function (loginDict){
    if(!loginDict.username || loginDict.username.lenght == 0){
        throw 'No username provided';
    }else if(!loginDict.pass || loginDict.pass.lenght == 0){
        throw 'No password provided';
    }
}

//username e password devem ser os nomes usado no banco (name no form)
LoginDAO.prototype.findUserByNameAndPass = function(db, loginDict, callback){
    db.collection("user").findOne({
        username: loginDict.username,
        pass: loginDict.pass
    }, function(err, user){
        if (err){
            callback (err);
        }else if (!user){
            callback ("Usuário ou senha inválidos!");
        }else{
            callback(null, user);
        }
    });
}
module.exports = new LoginDAO();