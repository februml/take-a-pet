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
    response.locals.name = request.session.name;
    next();
});

//HOME-PAGE
app.get("/", function(request, response){
    try{
        let allPets = PetDAO.findRecent(db, function(pets){
            //console.log(JSON.stringify(pets));
            response.render("index.ejs", {
                isMain: true,
                petList: pets
            });
        });
    }catch (err){
        response.render("message.ejs", {message: "Erro ao listar pets: " + err});
    }
});

//FUNCIONAMENTO
app.get("/como-funciona.html", function(request, response){
    response.render("como-funciona.ejs");
});

//PRIMEIROS SOCORROS
app.get("/primeirosSocorros.html", function(request, response){
    response.render("primeirosSocorros.ejs");
});

//ATENDIMENTOS
app.get("/atendimento.html", function(request, response){
    response.render("atendimento.ejs");
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
                sess.name = user.name;
                response.locals.username = user.username;
                response.redirect("/");
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
    request.session.name = null; //limpar sessão
    response.locals.name = null;
    response.render("Login.ejs", {message: "Deslogado com sucesso!"});
});

//USUÁRIO
app.get("/cadastrarUsuario.html", function(request, response){
    response.render("cadastrarUsuario.ejs");
});

//CADASTROU COM SUCESSO
app.get("/cadastro-sucesso.html", function(request, response){
    response.render("cadastro-sucesso.ejs");
});

//FALHA AO CADASTRAR
app.get("/cadastro-falha.html", function(request, response){
    response.render("cadastro-falha.ejs");
});

//CADASTRO USUÁRIO
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
    UserDAO.findUserByName(db, request.body.username, function(existingUser){
        if(existingUser){
            response.render("cadastro-falha.ejs", {
                message: "Usuário já existente com este username"
            });
        }else{
            try{
                UserDAO.validate(newUser);
                UserDAO.save(db, newUser, function(user){
                    let sess = request.session;
                    sess.username = user.username;
                    sess.name = user.name;
                    response.redirect("/");
                });
            }catch (err){
                //response.render("message.ejs", {message: "Erro ao cadastrar usuário: " + err});
                response.render("cadastro-falha.ejs");
            }
        }
    });
});

app.post("/tentar-novo-cadastro", function(request, response){
	response.render("cadastrarUsuario.ejs");
});

app.get("/exibirUsuario.html", function(request, response){
    let username = request.session.username;
    try {
        let userData = UserDAO.findUserAndPetsByName(db, username, function(user) {
            console.log(JSON.stringify(user));
            response.render("exibirUsuario.ejs", {
                userInfo: user
            });
        });
    } catch(err) {
        response.render("message.ejs", {message: "Erro ao carregar usuário: " + err});
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
            //console.log(JSON.stringify(pets));
            response.render("listarPets.ejs", {
                petList: pets
            });
        });
    }catch (err){
        response.render("message.ejs", {message: "Erro ao listar pets: " + err});
    }

});

app.get("/findPet/:petId", function(request, response){
    try {
         PetDAO.findByID(db, request.params.petId, function(petData) {
            //console.log(petData);
            response.send(petData);
         });
    } catch (err) {
        response.render("message.ejs", {message: "Erro ao listar pets: " + err});
    }

});

app.post("/cadastrarPet-action", function(request, response){
    //console.log(JSON.stringify(request.body));
    let sess = request.session;
    var newPet = {
        type: request.body.espec,
        sex: request.body.sexo,
        size: request.body.porte,
        age: request.body.idadePet,
        date: request.body.data,
        address: request.body.endpet,
        help: request.body.tipoajuda,
        username: sess.username,
        name: sess.name
    }
    try{
        PetDAO.validate(newPet);

        UserDAO.findUserByName(db, newPet.username, function(user){
            PetDAO.save(db, newPet, user);
            setTimeout(function() {
                PetDAO.findAll(db, function(pets){
                    response.render("listarPets.ejs", {
                        petList: pets
                    });
                });
            }, 1000);
        });
    }catch (err){
        response.render("message.ejs", {message: "Erro ao cadastrar pet: " + err});
    }
});

//404
app.get("/404.html", function(request, response){
    response.render("404.ejs");
});

//Volta pro index
app.post("/voltar-action", function(request, response){
	response.redirect("/");
});

//Redimensiona qualquer página que não existe para 404.ejs
app.get('/*', function(request, response){
   response.render('404', {});
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