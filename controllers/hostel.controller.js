const Hostel=require("../models/hostel");
const fs = require("fs");


exports.getHostel=async (req,res,next)=>{

    const hostel=await Hostel.findOne({name: req.params.name});
    

    if(hostel==null){
        res.status(404).json({
            status:'not found',
            data:{
                data:hostel,
            }
        });
     return next();
    };
    const name=req.params.name;
    const members=hostel.management;
    members.sort((a,b)=>(a.priority>b.priority? 1:-1));
  

    res.render("Hmember",{members,link:"/hostels/"+name+"/addMember",name});
};
exports.addMemberForm = (req, res) => {
    const name=req.params.name;
    res.render("member_add",{link:"/hostels/"+name,name});
  };
  exports.addHostelForm = (req, res) => {
    res.render("hostel_add",{link:"/hostels"});
  };

exports.createHostel=async (req, res)=>{
    var {name}=req.body;
    name=name.charAt(0).toUpperCase()+name.slice(1);
    var pic;
    if(req.file)
    pic = req.file.filename;
const newHostel = new Hostel({name, pic});
    await newHostel.save();
  return res.redirect("/hostels");

  }

exports.createMember=async(req,res,next)=>{
const { Mname, position,priority, contact, email} = req.body;
const name=req.params.name;
var photo;
if(req.file)
photo = req.file.filename;
const member={
  Mname,
  position,
  priority,
  photo,
  contact,
  email
}
Hostel.findOneAndUpdate(
  {name:name},
  {$push:{management:member}},
  function(error){
    if(error){
      console.log(error);
  }
}
);

res.redirect('back');
};


exports.getAllHostels=async(req,res,next)=>{
    const hostels=await Hostel.find({});

    res.render("hostel",{hostels,link:"/hostels/addHostel"});
    
};

exports.deleteMember = async (req, res) => {
    try {
      const name = req.params.name;
      const id = req.params.id;
      const hostel=await Hostel.findOne({name: name});
      var member=hostel.management;
      member=
        member.filter(function (object){
          return object.id==id;
        });
      
      if(member[0].photo){
      fs.unlinkSync(`uploads/hostel/${member[0].photo}`);
      console.log("successfully deleted /tmp/hello");
      }
      hostel.management.pull({ _id: id });
      await hostel.save();
      res.redirect("/hostels/"+name);
    } catch (err) {
      // handle the error
      console.log(err);
      res.redirect("/hostels/"+req.params.name);
    }
  };

  exports.deleteHostelMembers = async (req, res) => {
    try {
      
      const name = req.params.name;
      const hostel = await Hostel.findOne({name:name});
      var members=hostel.management;
      members.forEach(member => {
        if(member.photo)
      fs.unlinkSync(`uploads/hostel/${member.photo}`);
      });
      hostel.management.splice(0,hostel.management.length);
      await hostel.save();
      console.log("successfully deleted all members");

      res.redirect("/hostels/"+name);
    } catch (err) {
      // handle the error
      console.log(err);
      res.redirect("/hostels/"+req.params.name);
    }
  };
  exports.deleteHostel=async (req, res) => {
    try {
      const id = req.params.id;
      const hostel = await Hostel.findById(id);
      fs.unlinkSync(`uploads/hostel/${hostel.pic}`);
      var members=hostel.management;
      members.forEach(member => {
        if(member.photo)
      fs.unlinkSync(`uploads/hostel/${member.photo}`);
      });

      console.log("successfully deleted!");
      await Hostel.findByIdAndRemove(id);
      return res.redirect("/hostels");
    } catch (err) {
      // handle the error
      console.log(err);
      return res.redirect("/hostels");
    }
  };
