const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    console.log("yes");
});

module.exports = router;
// router.get("/", (req, res) => {
//     User.find().exec( (error, users) => {
//         if(error){
//             return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
//         }
//         res.render("admin/users/users",{data: users});
//     });
// });

// router.get("/edit/:id", (req, res) => {
//     User.findById(req.params.id).exec( (error, user) => {
//         if(error){
//             return res.status(404).json({"error": "no_endpoint", "errorText":"No such API end point"});
//         }
//         res.render("admin/users/edituser",{data: user});
//     });
// });