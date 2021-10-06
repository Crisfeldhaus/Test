const express = require ('express');
const router = express.Router();
const Studie = require ("../studies/Studie")
const Termin = require ("./Termin")
const slugify = require ("slugify")
const authUser = require("../middlewares/authUser")
const authRole = require("../middlewares/authRole")
const moment = require ("moment"); 


router.get("/admin/termine",authUser ,authRole, (req, res) => {
    Termin.findAll({ include:[{model: Studie}]
  }).then(termines => {
      res.render("admin/termin/termine" , {termines:termines})
    })
});

router.get("/admin/termin/new-termin",authUser,authRole, (req,res) =>{
  Studie.findAll().then(studies => {
    res.render("admin/termin/new-termin", {studies : studies})  
  })
})

router.post("/termine/save",authUser,authRole, ( req, res )=> {
  var titel = req.body.titel;
  var datum = req.body.datum
  datum = moment(datum ,'DD-MM-YYYY').format("MM-DD-YYYY");
  var uhrzeit = req.body.uhrzeit
  uhrzeit =  moment(uhrzeit ,'HH:mm').format("HH:mm");
  var ort = req.body.ort
  var studie = req.body.studie

  Termin.create({
    titel: titel,
    slug: slugify(titel),
    datum: datum,
    uhrzeit: uhrzeit,
    ort: ort,
    studie_id: studie,
  }).then(() =>{
    res.redirect("/admin/termine")
  })
}) 

router.post("/termine/delete",authUser,authRole, (req,res) => {
  var termin_id = req.body.termin_id
  if(termin_id != undefined){
    if(!isNaN(termin_id)){

      Termin.destroy({
        where:{
          termin_id:termin_id
        }
      }).then(() =>{
        res.redirect("/admin/termine")
      })

    }else{
      res.redirect("/admin/termine")
    }
  }else{
    res.redirect("/admin/termine")
  }
});

router.get("/admin/termine/edit/:termin_id",authUser, authRole,(req,res) => {
  var termin_id = req.params.termin_id
  
  if(isNaN(termin_id)){
    res.redirect("/admin/termine")
  }
  Termin.findByPk(termin_id).then(termin1 => {
    if(termin1 != undefined){
      res.render("admin/termin/edit",{termines: termin1});
    }else{
      res.redirect("/admin/termine");
    }
  }).catch(erro => {
    res.redirect("/admin/termine");
  });
});

router.post("/termine/update", authUser, authRole,(req,res) => {
  var termin_id = req.body.termin_id
  var titel = req.body.titel;
  var datum = req.body.datum;
  datum = moment(datum ,'DD-MM-YYYY').format("MM-DD-YYYY");
  var uhrzeit = req.body.uhrzeit
  uhrzeit =  moment(uhrzeit ,'HH:mm').format("HH:mm");
  var ort = req.body.ort;
  
  Termin.update({
    titel : titel, 
    datum : datum,
    uhrzeit: uhrzeit,
    ort : ort,
    slug: slugify(titel)
  },{
    where:{
      termin_id : termin_id
    }
  }).then(() => {
    res.redirect("/admin/termine")
  })

}); 

router.post("/termin/anmelden", authUser , (req, res )=>{
  var termin_id = req.body.termin_id
  var user_id = req.session.user.id

  Termin.update({
    user_id : user_id
  },{
    where:{
      termin_id : termin_id
    }
  }).then(() =>{
    res.redirect("/experimente")
  })
})

router.post("/termin/abmelden", authUser , (req, res )=>{
  var termin_id = req.body.termin_id
  //var user_id = req.session.user.user_id

  Termin.update({
    user_id : null
  },{
    where:{
      termin_id : termin_id,
      //user_id : user_id
    }
  }).then(() =>{
    res.redirect("/experimente")
  })

})

module.exports = router;