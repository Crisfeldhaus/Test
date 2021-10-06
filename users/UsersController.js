const express = require("express");
const router = express.Router();
const User = require("./User")
const bcrypt = require('bcryptjs')
const authUser = require("../middlewares/authUser") 
const flash = require ("connect-flash")


router.get("/admin/users", (req,res) =>{
    if(req.session.user == undefined){
        res.redirect("/")
    }
    User.findAll().then( users => {
        res.render("admin/users/index" , {beta_users: users})
    })
})

router.get("/admin/users/create", (req,res)=> {
    res.render("admin/users/create" , {message : req.flash('message')})
})

router.post("/users/create" ,(req, res) =>{
    var email = req.body.email
    var vorname = req.body.vorname

    User.findOne({where:{email :email}}).then(user => {
        if(user == undefined){

            var nachname = req.body.nachname
            var password = req.body.password
                  
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                vorname:vorname,
                nachname:nachname,
                password:hash
            }).then(()=> {
                res.redirect("/");
            }).catch((err)=> {
                res.redirect("/")
            })
            
        }
        else{
            req.flash('message' , 'Error bei der Registrierung ! Versuchen Sie mit einem neuen Email!')
            res.redirect("/admin/users/create")
        }
    })
})

router.get("/login" , (req,res)=>{
    res.render("admin/users/login")
})
router.post("/authenticate" , (req, res)=>{

    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email:email}}).then(user =>{
        if(user != undefined){ // wenn ein user mit diesem email gibt
            
            //Passwort validieren
            var correct = bcrypt.compareSync(password, user.password)

            if(correct){
                req.session.user ={
                    id: user.user_id,
                    email : user.email,
                    role: user.role
                }
                //res.json(req.session.user) testen
                req.flash('message' , 'Login erfolgreich !')
                if(req.session.user.role == 1){
                    res.redirect("/admin/termine")
                }
                else{
                    res.redirect("/")
                }     
            }else{
                res.redirect("/login")
            }
        }
        else{
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/")
})

router.get("/admin/users/edit", authUser , (req,res) => {
    
    User.findByPk(req.session.user.id).then(user => {
      if(user != undefined){
        res.render("admin/users/edit",{beta_users: user});
      }else{
        res.redirect("/");
      }
    }).catch(erro => {
      res.redirect("/");
    });
  });
  
  router.post("/users/update" , authUser, (req,res) => {
    var user_id = req.body.user_id
    var email = req.body.email;
    var vorname = req.body.vorname;
    var nachname = req.body.nachname;
    
    User.update({
      email : email, 
      vorname : vorname,
      nachname :nachname

    },{
      where:{
        user_id : user_id
      }
    }).then(() => {
      res.redirect("/")
    })
  }); 

module.exports= router;