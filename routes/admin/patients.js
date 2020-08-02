const express = require("express");
const router = express.Router();

const Patient = require("../../models/Patient.js");
const Questionnaire = require("../../models/Questionnaire.js");

router.get("/", (req, res) => {
    Patient.find().sort("-dateofentry").exec( (error, patients) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/patients/patients",{data: patients});
    });
});

router.get("/edit/:id", (req, res) => {
    Patient.findById(req.params.id).exec( (error, patient) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        let data = [patient];
        Questionnaire.find({}).select('_id title description').exec( (err, questionnaires)=>{
            if(error){
                return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
            }
            data.push(questionnaires);
            res.render("admin/patients/editpatient",{data: data});
        });
    });
});

router.post("/edit/:idPacient", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let gender = req.body.gender;
    let birthday = req.body.birthday;
    let maritalstatus = req.body.maritalstatus;
    let ocuppation = req.body.ocuppation;
    let address = req.body.address;
    let district = req.body.district;
    let municipality = req.body.municipality;
    let state = req.body.state;
    let numberphone = req.body.numberphone;
    let email = req.body.email;
    
    let id =req.params.idPacient;
    Patient.findByIdAndUpdate( {"_id":id} , { $set:{
        firstname : firstname,
        lastname : lastname,
        address : address,
        district : district,
        municipality : municipality,
        state : state,
        gender : gender,
        birthday : new Date(birthday),
        maritalstatus : maritalstatus,
        ocuppation : ocuppation,
        numberphone : numberphone,
        email: email,
        dateofentry: Date.now()
    }
} , {new:false})
    .then(data => {
        res.redirect("/admin-8E4145/patients");
    }).catch( err => {
        res.redirect("/admin-8E4145/patients/edit/"+id);
    });
});

router.get("/addnewpatient", (req, res) => {
    res.render("admin/patients/newPatient");
});

router.post("/createnew", (req, res) => {
    
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let gender = req.body.gender;
    let birthday = req.body.birthday;
    let maritalstatus = req.body.maritalstatus;
    let ocuppation = req.body.ocuppation;
    let address = req.body.address;
    let district = req.body.district;
    let municipality = req.body.municipality;
    let state = req.body.state;
    let numberphone = req.body.numberphone;
    let email = req.body.email;

    let newPatient = new Patient({
        firstname : firstname,
        lastname : lastname,
        address : address,
        district : district,
        municipality : municipality,
        state : state,
        gender : gender,
        birthday : new Date(birthday),
        maritalstatus : maritalstatus,
        ocuppation : ocuppation,
        numberphone : numberphone,
        email: email,
        dateofentry: Date.now()
    })
    newPatient.save()
        .then(data => {
        res.redirect("/admin-8E4145/patients");
    }).catch( err => {
        console.log(err);
        res.redirect("/admin-8E4145/patients/addnewpatient");
    });
});

module.exports = router;