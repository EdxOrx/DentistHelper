const express = require("express");

const argon2 = require('argon2-browser');


const Salt = require("../../config/salt");
const router = express.Router();

const User = require("../../models/User.js");
const session = require("express-session");

router.get("/", (req, res) => {
    if(req.session.privileges === 'superuser'){
        User.find().exec( (error, Users) => {
            if(error){
                return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
            }
            res.render("admin/users/users",{data: Users});
        });
    }else{
        User.find({"_id":req.session.userId}).exec( (error, Users) => {
            if(error){
                return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
            }
            res.render("admin/users/users",{data: Users});
        });
    }
});

router.get("/exit", (req, res) => {
    req.session.destroy();
    res.redirect('/admin-login-5052136');
});

router.get("/edit/:id", (req, res) => {
    if(req.session.privileges === 'superuser' || (req.session.userId).toString() === req.params.id){
        User.findById(req.params.id).select('firstname lastname email privileges gender birthday numberphone').exec( (error, user) => {
            if(error){
                return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
            }
            if((req.session.userId).toString() == req.params.id){
                res.render("admin/users/edituser",{data: user});
            }else{
                res.render("admin/users/editusers",{data: user});
            }
        });
    }
});

router.get("/addnewuser", (req, res) => {
    res.render("admin/users/newuser");
});

router.post("/addnewuser", (req, res) => {
    if(req.session.privileges === 'superuser'){
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = req.body.password;
        let privileges = req.body.privileges;
        let gender = req.body.gender;
        let birthday = req.body.birthday;
        let numberphone = req.body.phone;
        User.findOne({email:email}, (err, element) => {
            if(err) res.redirect('/admin-8E4145/users/addnewuser');
            if(element === null || element === undefined){
                argon2
                .hash({
                    pass: password,
                    salt: Salt(25),
                    type: argon2.ArgonType.Argon2i
                })
                .then(hash => {
                    let newUser =  new User({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hash.encoded,
                        privileges: privileges,
                        gender: gender,
                        birthday: birthday,
                        numberphone: numberphone
                    });
                    newUser.save(function(err){
                        if(err){
                            res.redirect('/admin-8E4145/users/addnewuser');
                        }else{
                            res.redirect('/admin-8E4145/users')
                        }                            
                    });
                })
                .catch(e => res.redirect('/admin-8E4145/users/addnewuser'));
            }else{
                res.redirect('/admin-8E4145/users/addnewuser');
            }
        });
    }
});


router.post("/update/:id", (req, res) => {
    if(req.session.privileges === 'superuser' ){

        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = req.body.password;
        let privileges = req.body.privileges;
        let gender = req.body.gender;
        let birthday = req.body.birthday;
        let numberphone = req.body.phone;
        let id = req.params.id;
        argon2
            .hash({
                pass: password,
                salt: Salt(25),
                type: argon2.ArgonType.Argon2i
            })
            .then(hash => {
                User.findByIdAndUpdate( {"_id":id} , { $set:{
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hash.encoded,
                    privileges: privileges,
                    gender: gender,
                    birthday: birthday,
                    numberphone: numberphone
                    }
                } , {new:false})
                    .then(data => {
                        res.redirect("/admin-8E4145/users");
                    }).catch( err => {
                        res.redirect("/admin-8E4145/users/edit/"+id);
                    });
            })
            .catch(e => res.redirect('/admin-8E4145/users/edit/'+id));
        
    }
});

router.post("/update/user/:id", (req, res) => {
    if((req.session.userId).toString() === req.params.id ){
        
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = req.body.password;
        let privileges = req.body.privileges;
        let gender = req.body.gender;
        let birthday = req.body.birthday;
        let numberphone = req.body.phone;
        let id = req.params.id;
        User.findById({"_id":req.session.userId } ,(err, element) => {
            if(err){
                res.redirect('/admin-login-5052136');
            }
            if(element === null || undefined){
                res.redirect('/admin-login-5052136');
            }else{
                argon2.verify({ pass: password, encoded: element.password })
                    .then(() => {
                        User.findByIdAndUpdate( {"_id":id} , { $set:{
                            firstname: firstname,
                            lastname: lastname,
                            email: email,
                            privileges: privileges,
                            gender: gender,
                            birthday: birthday,
                            numberphone: numberphone
                            }
                        } , {new:false})
                            .then(data => {
                                res.redirect("/admin-8E4145/users");
                            }).catch( err => {
                                res.redirect("/admin-8E4145/users/edit/"+id);
                            });
            })
            .catch(e => res.redirect('/admin-8E4145/users/edit/'+id));
            }
        });
    }
});


router.post('/changepassword', (req,res)=>{
    let current = req.body.current;
    let pass1 = req.body.newpass1;
    let pass2 = req.body.newpass2;
    User.findById({"_id":req.session.userId } ,(err, element) => {
        if(err){
            res.redirect('/admin-login-5052136');
        }
        if(element === null || undefined){
            res.redirect('/admin-login-5052136');
        }else{
            argon2.verify({ pass: current, encoded: element.password })
                .then(() => {
                    argon2
                        .hash({
                            pass: pass1,
                            salt: Salt(25),
                            type: argon2.ArgonType.Argon2i
                        })
                        .then(hash => {
                            User.findByIdAndUpdate( {"_id":req.session.userId} , { $set:{
                                password: hash.encoded
                                }
                            } , {new:false})
                                .then(data => {
                                    res.status(404).json({"success": "Success", "successText":data});
                                }).catch( err => {
                                    res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
                                });
                        })
                        .catch(e => res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"}));
                })
                .catch(e => res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"}));
        }
    });
    
});
module.exports = router;