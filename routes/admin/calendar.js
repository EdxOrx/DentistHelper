const express = require("express");
const router = express.Router();
var multer  = require('multer');

const Patient = require("../../models/Patient.js");
const Treatment = require("../../models/Treatment.js");
const TypeOfTreatment = require("../../models/TypeOfTreatment.js");
const Appointment = require("../../models/Appointment.js");

router.get("/", (req, res) => {
	res.render("admin/calendar/calendar");
});

router.post("/newappointment/name", (req, res) => {
	Patient
		.find( {$expr:{$or:[req.body.name,{$concat:["$firstname"," ","$lastname"]}] } } )
		.select(`id firstname lastname address birthday`)
		.exec(function(err, elements){
			if(err){
				res.status(404).json({"error": "no_endpoint", "errorText":"No connection with the database"})
			}else{
				res.status(200).json({"success": "done", "successText":elements}); 
			}  
		});
});

router.post("/newappointment/treatment", (req, res) => {
	Treatment
		.find( {patientId:req.body.id } )
		.select(`id typeoftreatmentId appointmentId start`)
		.exec(function(err, elements){
			if(err){
				res.status(404).json({"error": "no_endpoint", "errorText":"No connection with the database"})
			}else{
				let idsTypesTreatments = [];
				let lengthT = elements.length;
				for(let i = 0; i < lengthT ;i++ ){
					idsTypesTreatments = [...idsTypesTreatments, elements[i].typeoftreatmentId];
				}
					
				TypeOfTreatment.find().where('_id').in(idsTypesTreatments).exec( (err, types )=>{
					if(err){
						res.status(404).json({"error": "no_endpoint", "errorText":"No connection with the database"})
					}else{
						let data = {};
						
						for(let i = 0; i < lengthT ;i++ ){
							for(let j = 0; j < types.length ;j++ ){
								
								if(elements[i]["typeoftreatmentId"] == types[j]["id"] ){
									data[j] = { idtreatment:elements[i]["id"], typeoftreatmentId:types[j]["id"], typeoftreatmenttitle:types[j]["title"], start:elements[i]["start"] }
								}
							}
						}
						res.status(200).json({"success": "done", "successText":data}); 
					}
				});
			}  
		});
});

router.post("/newappointment", (req, res) => {

	let treatmentId = req.body.treatmentId;
    let patientId = req.body.patientId;
    let userId = req.body.userId;
    let datetime = req.body.datetime;
    let newAppointment = new Appointment({
        treatmentId : treatmentId,
		patientId : patientId,
		userId : userId,
		datetime : datetime
    });
	
    newAppointment.save()
        .then( item => {
			Treatment.findOneAndUpdate({_id:treatmentId}, {$push: {appointmentId: item._id}}, {new:false}).exec((err,treatment) => {
				if(err){
					res.status(404).json({"error": "no_endpoint", "errorText":"No connection with the database"})
				}else{
					res.status(200).json({"success": "done", "successText":item}); 
				}
			});
        })
        .catch( err => {
            res.status(404).json({"error": "no_endpoint", "errorText":"No connection with the database"});
        });
});

router.get("/getappointments", (req, res) => {
	
	Appointment.find().exec( (err, appointments) => {
		let idsPatients = [];
		let lengthT = appointments.length;
		for(let i = 0; i < lengthT ;i++ ){
			idsPatients = [...idsPatients, appointments[i].patientId];
		}
		Patient.find().where('_id').in(idsPatients).exec( (err, patients )=>{
			if(err){
				res.status(404).json({"error": "no_endpoint", "errorText":"No connection with the database"});
			}else{
				let arrayAppointments = [];
				let lengthP = patients.length;
				for(let i = 0 ; i <lengthT ;i++ ){
					for(let j =0 ; j < lengthP; j++){
						if(appointments[i]["patientId"] == patients[j]["id"]){
							arrayAppointments.push({
								id:appointments[i]["id"],
								title:patients[j]["firstname"]+" "+patients[j]["lastname"],
								start:appointments[i]["datetime"],
								end:appointments[i]["datetime"]
							});
						}
					}
				}
				res.status(200).json(arrayAppointments);
			}
		});
	});
});


router.get("/appointments", (req, res) => {
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
	function getAllTreatmentsPatientsTypesAppointments(elements){
        return new Promise( (resolve, reject) => {
            Appointment.find().sort("-datetime").exec( (err, appointments )=>{
                if(err){
                    return reject(err);
                }else{
                    let data = [elements[0], elements[1], elements[2],appointments];
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
		.then( treatmentsPatientsTypes =>{
			return getAllTreatmentsPatientsTypesAppointments(treatmentsPatientsTypes)
		} )
        .then( all => {
            res.render("admin/calendar/appointments",{data: all});
        })
        .catch( err => {
            res.render("admin/calendar/appointments",{err: err});
        });
});

router.get("/appointment/edit/:id", (req, res) => {
	Appointment.findById({_id:req.params.id}).exec((err, appointment)=>{
		if(err){
			res.redirect("/admin-8E4145/calendar/appointments");
		}else{
			let data = [appointment];
			Patient.findById({_id:appointment.patientId}).exec( (err, patient )=>{
				if(err){
					res.redirect("/admin-8E4145/calendar/appointments");
				}else{
					data.push(patient);
					res.render("admin/calendar/editappointment",{data:JSON.stringify(data)});
				}
			});
		}
	});
});


router.post("/appointment/edit/:id", (req, res) => {
	let comments = req.body.description;
	let odontogram = req.body.teeths;
	let id = req.params.id;
	Appointment.findOneAndUpdate({_id:id}, {
		comments:comments,
		odontogram:odontogram
	},{new:false}).exec((err, appointment)=>{
		if(err){
			res.redirect("/admin-8E4145/calendar/appointment/edit/"+id);
		}else{
			res.redirect("/admin-8E4145/calendar/appointments");
		}
	});
});

module.exports = router;