const express = require("express");
const router = express.Router();
const hmcDetail = require("../../models/hostelModels/hmc.models");
// const { isAdmin, isLoggedIn } = require("../middlewares/adminauth");
const multer = require('multer');
const fs = require('fs');

//image upload 
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

//Importing the controller
const hmcController = require("../../controllers/hostelControllers/hmc.controllers");

//Get details from database
router.get("/",  hmcController.getDetails);

//Add user to database
router.post('/add',upload,(req,res)=>{
    const detail = new hmcDetail({
        name: req.body.name,
        post: req.body.post,
        image: req.file.filename,
        contno: req.body.contno,
        roomno: req.body.roomno,
        email : req.body.email,
        priono : req.body.priono


    });
    detail.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'})
        }else{
            res.redirect("/hab/admin/hostel/:hostelName/hmc");
        }
    })

    
        
});

router.get("/add",(req,res)=>{
    res.render("views/hostelAdmin/hmc/add");
})

//Get details for editing
router.get("/:id",  hmcController.getEditDetails);

//Editing the user
router.post('/:id',upload,(req,res) =>{
    const id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/details_img'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image = req.body.old_image;
    }
    hmcDetail.findByIdAndUpdate(id, {
        name: req.body.name,
        post: req.body.post,
        image: new_image,
        contno: req.body.contno,
        roomno: req.body.roomno,
        email : req.body.email,
        priono : req.body.priono
    },(err,result)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.redirect('/hab/admin/hostel/:hostelName/hmc');
        }
    })

})
//Delete entry from database
router.get("/delete/:id",hmcController.deleteDetails);

module.exports = router;