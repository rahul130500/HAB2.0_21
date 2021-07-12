const express = require("express");
const router = express.Router();
const personalweb = require("../../models/hostelModels/personalweb.models");
// const { isAdmin, isLoggedIn } = require("../middlewares/adminauth");
const fs = require('fs');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/details_img');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});
const upload = multer({
    storage: storage,
}).single("image");
const personalwebController = require("../../controllers/hostelControllers/personalweb.controllers");



router.get("/add",(req,res)=>{
    res.render("hostelAdmin/personalweb/add");
});

router.get("/",personalwebController.getWeb);


router.get("/:id",personalwebController.getEditWeb);

router.post('/:id',upload,(req,res) =>{
    const id = req.params.id;
    
    personalweb.findByIdAndUpdate(id, {
        name: req.body.name,
        link: req.body.link,
    },(err,result)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.redirect('/hab/admin/hostel/:hostelName/personalweb');
        }
    })

})







module.exports = router;