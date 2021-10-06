const express = require("express")
const app = express()
const connection = require("./database/db")
const session = require("express-session")
const flash = require("connect-flash")

const categoriesController = require("./termine/TermineController");
const studiesController = require("./studies/StudiesController");
const usersController = require("./users/UsersController")

const Studie = require("./studies/Studie")
const Termin = require("./termine/Termin")
const User = require("./users/User");
const authUser = require("./middlewares/authUser");


//view engine
app.set('view engine', 'ejs');

//Sessions, spater redis nutzen

app.use(session({
    secret: "jkdfbhdjkasncjkncsacqnjacjasjs678234657623572341", cookie:{ maxAge: 30000000 }
})) 
//check wenn user eingellogt ist
app.use(function(req, res, next){  
    res.locals.Loggedin = req.session.user;
    next()
}); 
//Fehler Meldung
app.use(flash())


//Static
app.use(express.static('public'));

//Body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Database

connection
    .authenticate()
    .then(() => {
        console.log("Verbindung Erfolgreich");
    }).catch((error) =>{
        console.log(error)
    })

app.use("/", categoriesController);
app.use("/", studiesController);
app.use("/",usersController)


app.get("/",(req,res)=>{ 
    res.render("index",{message: req.flash('message')})
})

app.get("/experimente" ,(req, res)=>{
    Studie.findAll({
        order:[
            ['studie_id' , 'DESC']
        ]
    }).then(studies =>{
        res.render("experimente", {studies:studies})
    })
})



app.get("/:slug",(req, res) => {
    var slug = req.params.slug;
    Studie.findOne({
        where: {
            slug: slug
        },
        include:[{model: Termin}]

    }).then(studies => {
        if(studies != undefined){
            res.render("experimente-details" , {studies:studies})
            //TO-DO mit Table termin verknupfen
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/")
    })
})



app.listen(3000,function(){
    console.log("Server running at http://localhost:3000")
});