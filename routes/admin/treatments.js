const express = require("express");
const router = express.Router();

const Treatment = require("../../models/Treatment.js");
const TypeOfTreatment = require("../../models/TypeOfTreatment.js");
const Patient = require("../../models/Patient.js");

router.get("/", (req, res) => {
    function getAllTreatments(){
            return new Promise( (resolve, reject) => {
                Treatment.find({}, (error, treatments) => {
                    if(error){
                        return reject(error);
                    }else{
                        let idsPatients = [];
                        let idsTreatmentsType = []
                        let lengthT = treatments.length;
                        for(let i = 0; i < lengthT ;i++ ){
                            idsPatients = [...idsPatients, treatments[i].patientId];
                            idsTreatmentsType = [...idsTreatmentsType, treatments[i].typeoftreatmentId];
                        }
                        let data = [treatments, idsPatients, idsTreatmentsType]
                        return resolve(data);
                    }                
                });
            } );
    }
    function getAllTreatmentsPatients(idsPatients){
        return new Promise( (resolve, reject) => {
            let patientsArray = idsPatients[1];
            Patient.find().where('_id').in(patientsArray).exec( (err, patients )=>{
                if(err){
                    return reject(err);
                }else{
                    let data = [idsPatients[0], patients, idsPatients[2]];
                    return resolve(data);
                }
            });
        } );
    }
    function getAllTreatmentsPatientsTypes(elements){
        return new Promise( (resolve, reject) => {
            let types = elements[2];
            TypeOfTreatment.find().where('_id').in(types).exec( (err, types )=>{
                if(err){
                    return reject(err);
                }else{
                    let data = [elements[0], elements[1], types];
                    return resolve(data);
                }
            });
        } );
    }
    getAllTreatments()
        .then( treatmentsAndIdsPatients => {
            return getAllTreatmentsPatients(treatmentsAndIdsPatients);
        })
        .then( treatmentsPatients => {
            return getAllTreatmentsPatientsTypes(treatmentsPatients);
        })
        .then( all => {
            res.render("admin/treatments/treatments",{data: all});
        })
        .catch( err => {
            res.render("admin/treatments/treatments",{err: err});
        });
});

router.get("/edit/:id", (req, res) => {
    function getTreatment(id){
        return new Promise( (resolve, reject) => {
            Treatment.findById(id, (error, treatment) => {
                if(error){
                    return reject(error);
                }else{
                    return resolve(treatment);
                }                
            });
        } );
    }
    function getTreatmentsPatients(treatment){
        return new Promise( (resolve, reject) => {
            Patient.findById(treatment.patientId ,(err, patient )=>{
                if(err){
                    return reject(err);
                }else{
                    let data = [treatment, patient];
                    return resolve(data);
                }
            });
        } );
    }
    function getTreatmentsPatientsTypes(elements){
        return new Promise( (resolve, reject) => {
            TypeOfTreatment.findById( elements[0].typeoftreatmentId , (err, type )=>{
                if(err){
                    return reject(err);
                }else{
                    let data = [elements[0], elements[1], type];
                    return resolve(data);
                }
            });
        } );
    }
    function getTreatmentPatientTypeAppointment(elements){
        return new Promise( (resolve, reject) => {
            TypeOfTreatment.findById( elements[0].appointmentId , (err, appointments )=>{
                if(err){
                    return reject(err);
                }else{
                    let data = [elements[0], elements[1], elements[2], appointments];
                    return resolve(data);
                }
            });
        } );
    }
    getTreatment(req.params.id)
        .then( treatment => {
            return getTreatmentsPatients(treatment);
        })
        .then( treatmentPatient => {
            return getTreatmentsPatientsTypes(treatmentPatient);
        })
        .then( treatmentPatientType => {
            return getTreatmentPatientTypeAppointment(treatmentPatientType);
        } )
        .then( all => {
            res.render("admin/treatments/edittreatment",{data: all});
        })
        .catch( err => {
            res.render("admin/treatments/edittreatment",{err: err});
        });
});

router.get("/newtreatment", (req, res) => {
    TypeOfTreatment.find().exec( (error, types) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/treatments/newtreatment",{data: types});
    });
});

router.post("/newtreatment", (req, res) => {
    let typeoftreatmentId = req.body.idtratamiento;
    let patientId = req.body.idpatient;
    let price= req.body.price;    
    
    let newTreatment = new Treatment({
        typeoftreatmentId : typeoftreatmentId,
        patientId : patientId,
        price : price,
        start: Date.now()
    });

    newTreatment.save()
        .then(data => {
        res.redirect("/admin-8E4145/treatments");
    }).catch( err => {
        res.redirect("/admin-8E4145/treatments/newtreatment");
    });
});



router.get("/newtypeoftreatment", (req, res) => {
    res.render("admin/treatments/newtypeoftreatment");
});

router.get("/typeoftreatments", (req, res) => {
    TypeOfTreatment.find().exec( (error, types) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/treatments/typetreatments",{data: types});
    });
});

router.get("/typeoftreatments/edit/:idTreatment", (req, res) => {
    TypeOfTreatment.findById(req.params.idTreatment).exec( (error, type) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/treatments/typetreatmentsedit",{data: type});
    });
});

router.post("/typeoftreatments/edit/:idTreatment", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let priceChild= req.body.pricechild;
    let priceAdult = req.body.priceadult;
    let id = req.params.idTreatment;
    TypeOfTreatment.findByIdAndUpdate( {"_id":id} , { $set:{
        title : title,
        description : description,
        priceChild : priceChild,
        priceAdult : priceAdult
    }
} , {new:false})
    .then(data => {
        res.redirect("/admin-8E4145/treatments/typeoftreatments");
    }).catch( err => {
        res.redirect("/admin-8E4145/treatments/typeoftreatments/edit/"+id);
    });
});

router.post("/newtypeoftreatment", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let priceChild= req.body.pricechild;
    let priceAdult = req.body.priceadult;

    let newPatient = new TypeOfTreatment({
        title: title,
        description: description,
        priceChild:priceChild,
        priceAdult:priceAdult
    })
    newPatient.save()
        .then(data => {
        res.redirect("/admin-8E4145/treatments");
    }).catch( err => {
        res.redirect("/admin-8E4145/treatments/newtypeoftreatment");
    });
});

// router.post('/newtypeoftreatment', (req, res)=>{
//     let newT = new Treatment({
//         typeoftreatmentId: Object("5f0f35d75360b829acd975e3"),
//         patientId: Object("5f0e55f077048a32e852d3cf"),
//         price: 800,
//         start: Date.now()
//     });
//     newT.save()
//         .then( item => {
//             console.log(item);
//         })
//         .catch( err => {
//             console.log(err);
//         });
// })

module.exports = router;