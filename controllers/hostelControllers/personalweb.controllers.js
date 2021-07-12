const personalweb = require("../../models/hostelModels/personalweb.models");
const fs = require('fs');


exports.getWeb = async (req,res)=>{
    
    personalweb.find().exec((err,personalwebs)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("hostelAdmin/personalweb/index",{
                personalwebs: personalwebs,
            })
        }
    })
};

exports.getEditWeb = async (req,res) =>{
    const id = req.params.id;
    personalweb.findById(id ,(err,detail)=>{
        if(err){
            res.redirect('/');
        }else{
            if(detail == null){
                res.redirect('/');
            }
            else{
                res.render('hostelAdmin/personalweb/add',{
                    detail: detail,
                })
            }
        }
    })
};



