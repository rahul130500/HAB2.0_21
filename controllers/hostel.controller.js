const Member=require("../models/member");
const fs = require("fs");


exports.getHostel=async (req,res,next)=>{
    const members=await Member.find({Hname: req.params.name});

    if(!members){
        res.status(404).json({
            status:'not found',
            data:{
                data:members,
            }
        });
     return next();
    }
    const name=req.params.name;
    res.render("Hmember",{members,link:"/hostels/"+name+"/addMember",name});
};
exports.addMemberForm = (req, res) => {
    const Hname=req.params.name;
    res.render("member_add",{link:"/hostels/"+Hname,Hname});
  };

exports.createMember=async(req,res,next)=>{
const { name, position, contact, email} = req.body;
const Hname=req.params.name;
var photo;
if(req.file)
photo = req.file.filename;
else
photo="default.png";

const newMember = new Member({name,Hname,position,photo,contact,email});
await newMember.save();

res.redirect('back');
};


exports.getAllHostels=async(req,res,next)=>{
    const members=await Member.find({});
    res.status(201).json({
        status: 'success',
        data:{
            data:members,
        },
    });
};

exports.deleteMember = async (req, res) => {
    try {
      const Hname = req.params.name;
      const id = req.params.id;
      const member = await Member.findById(id);
      fs.unlinkSync(`uploads/${member.photo}`);
      console.log("successfully deleted /tmp/hello");
      await Member.findByIdAndRemove(id);
      res.redirect("/hostels");
    } catch (err) {
      // handle the error
      console.log(err);
      res.redirect("/hostels"+Hname);
    }
  };
  exports.deleteHostelMembers = async (req, res) => {
    try {
      const Hname = req.params.name;
      const members = await Member.find({Hname:Hname});
      members.forEach(member => {
      fs.unlinkSync(`uploads/${member.photo}`);
      });
      console.log("successfully deleted all members/tmp/hello");
      await Member.deleteMany({Hname:Hname});
      res.redirect("/hostels/"+Hname);
    } catch (err) {
      // handle the error
      console.log(err);
      res.redirect("/hostels/"+Hname);
    }
  };
