const express = require("express");
const router = express.Router();

const svgCaptcha = require('svg-captcha');

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
    res.render("users/contact",{data: captcha.data});
});
module.exports = router;