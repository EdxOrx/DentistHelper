const express = require("express");
const router = express.Router();

const Questionnaire = require('../../models/Questionnaire.js');
const Answer = require('../../models/Answer.js');

router.get("/", (req, res) => {
    Questionnaire.find({}, (err, questionnaires)=>{
        res.render("admin/questionnaire/questionnaire",{data: questionnaires});
    });
});

router.get("/newquestionnaire", (req, res) => {
    res.render("admin/questionnaire/newquestionnaire");
});
router.post("/newquestionnaire", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let questions = req.body.questions;
    let newQ = new Questionnaire({
        title: title,
        description: description,
        questions: questions
    });
    newQ.save()
        .then( item => {
            res.redirect("/admin-8E4145/questionnaire");
        })
        .catch( err => {
            res.redirect("/admin-8E4145/questionnaire/newquestionnaire");
        });
});



router.get("/edit/:id", (req, res) => {
    Questionnaire.findById(req.params.id).exec( (error, questionnaire) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/questionnaire/editquestionnaire",{data: questionnaire});
    });
});

router.post("/edit/:id", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let questions = req.body.questions;
    Questionnaire.findOneAndUpdate({ _id: req.params.id}, {
        title: title,
        description: description,
        questions: questions
    },{new:false}).exec( (error, questionnaire) => {
        if(error){
            res.redirect("/admin-8E4145/questionnaire/edit/"+req.params.id);
        }
        res.redirect("/admin-8E4145/questionnaire");
    });
});


// Patients
router.post("/available", (req, res) => {
    let id = req.body.id;
    Answer.find({"patientId":id}).exec( (err, answers) =>{
        let ids = [];
        for(let i = 0; i < answers.length; i++ ){
            ids.push((answers[i]["questionnaireId"]).toString());
        }
        Questionnaire.find({}, (err, questionnaires)=>{
            if(err){
                return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
            }else{
                questionnaires = questionnaires.filter( item => !ids.includes((item["_id"]).toString()));
                return res.status(200).json({"succes": "sucess", "successText":questionnaires});
            }
        });
    });
});


router.post("/single", (req, res) => {
    Questionnaire.findById({_id:req.body.id}, (err, questionnaire)=>{
        if(err){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }else{
            return res.status(200).json({"succes": "sucess", "successText":questionnaire});
        }
    });
});

router.post("/save", (req, res) => {
    let patientId = req.body.patientId;
    let questionnaireId = req.body.questionnaireId;
    let answers = req.body.answers;
    let newA = new Answer({
        patientId: patientId,
        questionnaireId: questionnaireId,
        answers: answers
    });
    newA.save()
        .then( item => {
            return res.status(200).json({"succes": "sucess", "successText":"Done"});
        })
        .catch( err => {
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        });
});

router.get("/done/:patientId", (req, res) => {
    Answer.find({"patientId":req.params.patientId}).exec( (err, questionnaires) =>{
        if(err){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }else{
            let ids = [];
            for(let i = 0; i < questionnaires.length; i++ ){
                ids.push(questionnaires[i]["questionnaireId"]);
            }
            Questionnaire.find().where('_id').in(ids).exec( (err, questionnaire)=>{
                if(err){
                    return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
                }else{
                    return res.status(200).json({"succes": "sucess", "successText":questionnaire});
                }
            });
        }
    });
});

router.post("/answers", (req, res) => {
    let questionnaireId = req.body.questionnaireId;
    let patientId = req.body.patientId;
    Answer.find({"questionnaireId": questionnaireId, "patientId": patientId}).exec( (err, answers) =>{
        if(err){
                console.log(err);
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }else{
            let data=[answers];
            Questionnaire.findById({"_id":questionnaireId}).exec( (error, questionnaire)=>{
                if(error){
                        console.log(error);
                    return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
                }else{
                    data.push(questionnaire);
                    return res.status(200).json({"succes": "sucess", "successText":data});
                }
            });
        }
    });
});

router.post("/answers/update", (req, res) => {
    let id = req.body.answersId;
    let answers = req.body.answers;
    Answer.findByIdAndUpdate({"_id": id} ,{ $set:{
        answers: answers
    }
} , {new:false} ).exec( (err, answers) =>{
        if(err){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }else{
            return res.status(200).json({"succes": "sucess", "successText":"Saved"});
        }
    });
});
module.exports = router;