const Mess = require('../models/hostelModels/mess');
const fs = require("fs");

exports.getMessInfo = async (req, res) => {
    try {
      const mess = await Mess.find({});
      
  
      mess.sort(compare);
      return res.render("mess/index", { mess });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  exports.addMessForm = async (req, res) => {
    try {
     
      return res.render("mess/add");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  exports.postMess = async (req, res) => {
    try {
      var { title, description, link } = req.body;
      
  
      const path = req.file ? req.file.filename : link;
      if (!path) {
        req.flash("error", "Please attach your pdf!!");
        return res.redirect("/hab/admin/mess/add");
      }
      //console.log(path);
      const newMess = await new Mess({
        title,
        description,
        path,
      }).save();
      if (!newMess) {
        req.flash("error", "Unable to add new mess data");
        res.redirect("/hab/admin/mess/add");
      }
      req.flash("success", "Successfully added new mess data");
      return res.redirect("/hab/admin/mess");
    } catch (error) {
      console.log(error.message);
    }
  };
  
exports.getMessEditForm = async (req, res) => {
    try {
      const mess = await Mess.findById(req.params.mess_id);
      
  
      return res.render("mess/edit", { mess});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  exports.editMess = async (req, res) => {
    try {
      var { title, description, link } = req.body;
      
  
      const path = req.file ? req.file.filename : link;
      let data;
      if (!req.file && !link) {
        data = { title, description };
      } else {
        data = { title, description, path };
      }
  
      
  
      const updatedMess = await Mess.findByIdAndUpdate(
        req.params.mess_id,
        data
      );
  
      if (!updatedMess) {
        req.flash("error", "Unable to edit mess data");
        return res.redirect("/hab/admin/mess");
      }
      req.flash("success", "Successfully editted mess data");
      return res.redirect("/hab/admin/mess");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  exports.getOneMess = async (req, res) => {
    try {
      const id = req.params.mess_id;
      const mess = await Mess.findById(id);
      const filePath = "uploads/mess_pdf/" + mess.path;
      console.log(filePath);
      fs.readFile(filePath, (err, data) => {
        res.contentType("application/pdf");
        return res.send(data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  exports.deleteMess = async (req, res) => {
    try {
      const id = req.params.mess_id;
      const mess = await Mess.findById(id);
      if (mess.path.indexOf("https://") == -1) {
        fs.unlinkSync(`uploads/mess_pdf/${mess.path}`);
        console.log("successfully deleted!");
      }
      await Mess.findByIdAndRemove(id);
      req.flash("success", "Successfully deleted mess data");
      return res.redirect("/hab/admin/mess");
    } catch (err) {
      // handle the error
      console.log(err);
      return res.redirect("/hab/admin/mess");
    }
  };
  
  
  const compare = (a, b) => {
    return b.creation - a.creation;
  };
  