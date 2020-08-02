const express = require("express");

const router = express.Router();

const Email = require('../../models/Email.js');

router.get('/', (req, res)=>{
    Email.find().sort('-sentdate').exec( (err, elements)=>{
        res.render("admin/emails/emails",{data: elements});
    });
});


module.exports = router;