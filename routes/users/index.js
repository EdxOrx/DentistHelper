const express = require("express");

const svgCaptcha = require('svg-captcha');
const router = express.Router();

const Post = require("../../models/Posts.js");
const Email = require('../../models/Email.js');

router.get("/", (req, res) => {
    var captcha = svgCaptcha.create({
        size: 6,
        noise: 5,
        width: 200,
        height: 70,
        fontSize: 70,
        color: true,
        background: '#f0f0f0'
    });
    req.session.captcha = captcha.text;
    Post.find().sort("-publisheddate").exec( (error, posts) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("users/index",{data:posts, captcha: captcha.data});
    });
});

router.post("/makeappointment", (req, res)=>{
    let name = req.body.name;
    let numberphone = req.body.phone;
    let email = req.body.email;
    let captcha = req.body.captcha;
    
    if(req.session.captcha === captcha){
        let newEmail = new Email({
            name: name,
            numberphone: numberphone,
            email: email,
            type: 'Hacer cita',
            sentdate: Date.now()
        });
    
        newEmail.save()
            .then( item => {
                res.status(200).json({"success": "Success", "SuccessText":"Tu email se ha enviado exitosamente"});
            })
            .catch( e => {res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"})})
    }else{
        res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
    }
});

router.post("/sendemail", (req, res)=>{
    let name = req.body.name;
    let text = req.body.text;
    let email = req.body.email;
    let captcha = req.body.captcha;
    
    if(req.session.captcha === captcha){
        let newEmail = new Email({
            name: name,
            text: text,
            email: email,
            type: 'Email',
            sentdate: Date.now()
        });
    
        newEmail.save()
            .then( item => {
                res.status(200).json({"success": "Success", "SuccessText":"Tu email se ha enviado exitosamente"});
            })
            .catch( e => {res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"})})
    }else{
        res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
    }
});



router.get("/newcaptcha", (req, res)=>{
    var captcha = svgCaptcha.create({
        size: 6,
        noise: 6,
        width: 200,
        height: 70,
        fontSize: 70,
        color: true,
        background: '#f0f0f0'
    });
    req.session.captcha = captcha.text;
    req.session.save(function(err){
        if(err){
            res.status(404).json({"data":"Error try again later."})
        }else{
            res.status(404).json({"data":captcha.data });
        }
    });
});

module.exports = router;