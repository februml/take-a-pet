const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;

const UserDAO = require('./app/UserDAO');
const PetDAO = require('./app/PetDAO');
const LoginDAO = require('./app/LoginDAO');

//configurando express aplicação
const app = express();

var db = null;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'takeapet', resave: true, saveUninitialized: true}));

app.use(function(request, response, next) {
    response.locals.username = request.session.username;
    next();
});

//HOME-PAGE
app.get("/", function(request, response){
    response.render("index.ejs", {
        isMain: true
    });
});

//FUNCIONAMENTO
app.get("/como-funciona.html", function(request, response){
    response.render("como-funciona.ejs");
});

//LOGIN
app.get("/login.html", function(request, response){
    response.render("login.ejs");
});

app.post("/login-action", function(request, response){
    var loginDict = {
        username: request.body.username,
        pass: request.body.senha
    }
    //validar
    //validar se existe
    try{
        LoginDAO.validate(loginDict);
        LoginDAO.findUserByNameAndPass(db, loginDict, function(err, user){
            if (err){
               response.render("Login.ejs", {message: "Erro ao fazer login: " + err}); 
            }else{
                let sess = request.session;
                sess.username = user.username;
                response.locals.username = user.username;
                response.render("index.ejs");
            }
        });
    }catch (err){
        response.render("Login.ejs", {message: "Erro ao fazer login: " + err});
    }
});

//LOGOUT
app.get("/logout-action", function(request, response){
    request.session.username = null; //limpar sessão
    response.locals.username = null;
    response.render("Login.ejs", {message: "Deslogado com sucesso!"});
});

//USUÁRIO
app.get("/cadastrarUsuario.html", function(request, response){
    response.render("cadastrarUsuario.ejs");
});

app.post("/cadastrarUsuario-action", function(request, response){
    var newUser = {
        name: request.body.nome,
        username: request.body.username,
        pass: request.body.senha,
        age: request.body.dataNascimento,
        email: request.body.email,
        address: request.body.endereco,
        phone: request.body.contato
    };

    try{
        UserDAO.validate(newUser);
        UserDAO.save(db, newUser);
        response.render("message.ejs", {message: "Usuário cadastrado com sucesso"});
    }catch (err){
        response.render("message.ejs", {message: "Erro ao cadastrar usuário: " + err});
    }

});

//PET
app.get("/cadastrarPet.html", function(request, response){
    let sess = request.session;
    if (sess.username){
        response.render("cadastrarPet.ejs");
    }else{
        response.render("Login.ejs", {message: "Faça login ou cadastre-se para cadastrar um pet"});
    }
});

app.get("/listarPets.html", function(request, response){
    try{
        let allPets = PetDAO.findAll(db, function(pets){
            response.render("listarPets.ejs", {
                petList: pets
            });
        });
    }catch (err){
        response.render("message.ejs", {message: "Erro ao listar pets: " + err});
    }

});

app.post("/cadastrarPet-action", function(request, response){
    console.log(JSON.stringify(request.body));
    var newPet = {
        type: request.body.espec,
        sex: request.body.sexo,
        size: request.body.porte,
        age: request.body.idadePet,
        date: request.body.data,
        address: request.body.endpet,
        help: request.body.tipoajuda
    }
    try{
        PetDAO.validate(newPet);
        PetDAO.save(db, newPet);
        response.render("message.ejs", {message: "Pet cadastrado com sucesso"});
    }catch (err){
        response.render("message.ejs", {message: "Erro ao cadastrar pet: " + err});
    }
});


//configurando o driver do Mongo
MongoClient.connect('mongodb://admin:takeapet@ds119091.mlab.com:19091/takeapet', function(err, database){
    if(err){
        console.log("Error conecting to Mongo", JSON.stringify(err));
    }else{
        console.log("Conected Mongo - Success");
        db = database;
        resetDatabase();
        app.listen(3000, function(){
            console.log("Express runing on port 3000");
        });
    }
});

var resetDatabase = function(){
    db.createCollection('user');
    db.createCollection('pet');
}