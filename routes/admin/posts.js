const express = require("express");
const router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/posts/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname )
    }
  });
var upload = multer({ storage: storage });

const fs = require('fs');



const Post = require("../../models/Posts.js");

router.get("/", (req, res) => {
    Post.find().sort("-publisheddate").exec( (error, posts) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/posts/posts",{data:posts});
    });
});

router.get("/edit/:id", (req, res) => {
    Post.findById( req.params.id , (error, post) => {
        if(error){
            return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
        }
        res.render("admin/posts/editpost",{data:JSON.stringify(post)});
    });
});

router.post("/edit/:idpost", upload.single('poster'), (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let description = req.body.description;
    let keywords = req.body.keywords;
    let status = "published";
    let visibility = "all";
    let poster = null;
    if(req.file){
        poster = req.file.originalname;
    }else{
        poster = req.body.postername;
    }
    let id =req.params.idpost;
    Post.findByIdAndUpdate( {"_id":id} , { $set:{
            "title": title,
            "content": content,
            "description": description,
            "keywords": keywords,
            "poster": poster,
            "status": status,
            "visibility": visibility
        }
    } , {new:false})
        .then(data => {
            res.redirect("/admin-8E4145/posts");
        }).catch( err => {
            res.redirect("/admin-8E4145/posts/edit/"+id);
        });
});
router.get("/delete", upload.none(), (req, res) => {
    res.send("put");
});

router.post("/delete", upload.none(), (req, res) => {
    let id = req.body.id;
    Post.findByIdAndDelete( id , (error, success) => {
        if(error){
            return res.status(200).json({"error": "no_endpoint", "errorText":"No such API end point"})
        }else{
            return res.status(404).json({"success": "done", "successText":"Eliminado exitosamente"});;
        }
    });
});

router.get("/createpost", (req, res) => {
    res.render("admin/posts/createpost");
});

router.post("/createpost", upload.single('poster'), (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let description = req.body.description;
    let keywords = req.body.keywords;
    let poster = req.file.originalname;
    let status = "published";
    let visibility = "all";
    let publisheddate = new Date(Date.now());
    
    let newPost = new Post({
        title: title,
        content: content,
        description: description,
        keywords: keywords,
        poster: poster,
        status: status,
        visibility: visibility,
        publisheddate: publisheddate
    });
    newPost.save()
        .then( item => {
            res.redirect("/admin-8E4145/posts");
        })
        .catch( err => {
            res.render("admin/posts/createpost",{"error": "no_endpoint", "errorText":postContent});
        });
});

router.post("/createpost/uploadimage", upload.single('file'), (req, res) => {
    if(req.file){
        return res.status(200).json({location: '/posts/images/'+req.file.originalname})
    }else{
        return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});;
    }
});


router.get('/createpost/images/list', (req, res) => {
    const getAllFiles = function(dirPath, arrayOfFiles) {
        files = fs.readdirSync(dirPath)

        arrayOfFiles = arrayOfFiles || []

        files.forEach(function(file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
            arrayOfFiles.push("/posts/images/"+file);
            }
        });

        return arrayOfFiles;
    }
    const result = getAllFiles('public/posts/images');
    res.status(200).json({"success": "done", "successText":result});
});

module.exports = router;