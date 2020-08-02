const express = require("express");
const router = express.Router();

const Post = require("../../models/Posts.js");

router.get("/", (req, res) => {
    Post.find().sort("-publisheddate").exec( (error, posts) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("users/posts",{data:posts});
    });
});

router.get("/:id", (req, res) => {
    let id = req.params.id;
    Post.findById({"_id":id}).exec( (error, post) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("users/singlepost",{data:JSON.stringify(post)});
    });
});

module.exports = router;