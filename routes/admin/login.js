const express = require("express");
const router = express.Router();
const argon2 = require('argon2-browser');
const svgCaptcha = require('svg-captcha');
const rateLimit = require('express-rate-limit');
const Users = require("../../models/User.js");

const Salt = require("../../config/salt");

const apiLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:20,
    message:"Demasiadas peticiones desde esta ip intenta despues de una hora"
});

router.get("/", (req, res) => {
    var captcha = svgCaptcha.create({
        size: 6,
        noise: 12,
        width: 200,
        height: 70,
        fontSize: 70,
        color: true,
        background: '#f0f0f0'
    });
    req.session.captcha = captcha.text;
    // argon2
    //     .hash({
    //         pass: "hola",
    //         salt: Salt(25),
    //         type: argon2.ArgonType.Argon2i
    //     })
    //     .then(hash => {
           
    //         console.log(hash.encoded);
    //     })
    //     .catch(e =>  res.status(404).json({"errors":"Error try again later."}));
    res.render("admin/login/login",{data:captcha.data});
});

router.post("/",apiLimiter,(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(req.body.captcha == req.session.captcha){
        Users.findOne({email:email} ,(err, element) => {
            if(err){
                res.redirect('/admin-login-5052136');
            }
            if(element === null || undefined){
                res.redirect('/admin-login-5052136');
            }else{
                argon2.verify({ pass: password, encoded: element.password })
                    .then(() => {
                        req.session.userId = element._id;
                        req.session.username = element.firstname+" "+element.lastname;
                        req.session.privileges = element.privileges;
                        req.session.adminAccess = true;
                        res.redirect('/admin-8E4145');
                    })
                    .catch(e => {
                        console.log(e);
                        res.redirect('/admin-login-5052136');
                    });
            }
        });
    }else{
        res.redirect('/admin-login-5052136');
    }
    
});

module.exports = router;

