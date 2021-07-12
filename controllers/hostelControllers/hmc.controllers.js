const hmcDetail = require("../../models/hostelModels/hmc.models");
const fs = require('fs');


exports.getDetails = async (req,res)=>{
    // res.render("../views/admin/hmc/index");
    hmcDetail.find().exec((err,hmcdetails)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("views/hostelAdmin/hmc/index",{
                hmcdetails: hmcdetails,
            })
        }
    })
};

exports.postDetails = async (req,res)=>{
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

    
        
};

exports.getEditDetails = async (req,res) =>{
    const id = req.params.id;
    hmcDetail.findById(id ,(err,detail)=>{
        if(err){
            res.redirect('/');
        }else{
            if(detail == null){
                res.redirect('/');
            }
            else{
                res.render('views/hostelAdmin/hmc/edit',{
                    detail: detail,
                })
            }
        }
    })
};


exports.editDetails = async (req,res) =>{
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

};

exports.deleteDetails = async (req,res)=>{
    const id = req.params.id;
    hmcDetail.findByIdAndRemove(id, (err,result)=>{
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/details_img/'+result.image);
            }catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message});
        }else{
            res.redirect('/hab/admin/hostel/:hostelName/hmc');
        }

    })
};