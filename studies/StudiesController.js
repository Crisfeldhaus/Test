const express = require ('express');
const router = express.Router();
const Studie = require("./Studie")
const slugify = require("slugify")
const authUser = require("../middlewares/authUser")
const authRole = require("../middlewares/authRole")

router.get("/admin/studie/new-studie",authUser,authRole, (req,res) => {
  res.render("admin/studie/new-studie");
});

router.post("/studie/save",authUser,authRole, (req,res) =>{
  var titel = req.body.titel;
  var beschreibung = req.body.beschreibung;
  var dauer = req.body.dauer_von_bis;
  var status = req.body.status;
  var vergutung = req.body.vergutung_std;
  if(titel != undefined){
    Studie.create({
      titel: titel,
      slug: slugify(titel),
      beschreibung: beschreibung,
      dauer_von_bis: dauer,
      status: status,
      vergutung_euro_std: vergutung
    }).then(()=>{
      res.redirect("/admin/studie")
    })
  }else{
    res.redirect("/admin/studie/new-studie")
  }
})

router.get("/admin/studie",authUser,authRole, (req,res) => { 
  Studie.findAll().then(studies =>{
    res.render("admin/studie/experimente", {studies: studies})
  })
})

router.post("/studie/delete",authUser,authRole ,(req,res) => {
  var studie_id = req.body.studie_id
  if(studie_id != undefined){
    if(!isNaN(studie_id)){

      Studie.destroy({
        where:{
          studie_id:studie_id
        }
      }).then(() =>{
        res.redirect("/admin/studie")
      })

    }else{
      res.redirect("/admin/studie")
    }
  }else{
    res.redirect("/admin/studie")
  }
});

router.get("/admin/studie/edit/:studie_id",authUser,authRole, (req,res) => {
  var studie_id = req.params.studie_id
  
  if(isNaN(studie_id)){
    res.redirect("/admin/studie")
  }
  Studie.findByPk(studie_id).then(studie1 => {
    if(studie1 != undefined){
      res.render("admin/studie/edit",{studies: studie1});
    }else{
      res.redirect("/admin/studie");
    }
  }).catch(erro => {
    res.redirect("/admin/studie");
  });
});

router.post("/studie/update" , authUser,authRole,(req,res) => {
  var studie_id = req.body.studie_id
  var titel = req.body.titel;
  var beschreibung = req.body.beschreibung;
  var dauer = req.body.dauer_von_bis;
  var status = req.body.status;
  var vergutung = req.body.vergutung_std;
  
  Studie.update({
    titel : titel, 
    beschreibung : beschreibung,
    dauer_von_bis : dauer,
    status : status,
    vergutung_euro_std : vergutung,
    slug: slugify(titel)

  },{
    where:{
      studie_id : studie_id
    }
  }).then(() => {
    res.redirect("/admin/studie")
  })

}); 

module.exports = router;