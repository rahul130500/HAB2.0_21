const About = require("../models/hostelModels/about.models");
const hmcDetail = require("../models/hostelModels/hmc.models");
const fs = require("fs");
const personalweb = require("../models/hostelModels/personalweb.models");

exports.getAboutDetails = async (req, res) => {
  try {
    const hostel = req.user.hostel;
    const aboutdetails = await About.find({ hostel })
      .sort({ _id: -1 })
      .limit(1);
    return res.render("hostelAdmin/about/index", { aboutdetails });
  } catch (err) {
    console.error(err);
    return res.json({
      message: err.message,
      type: "database connection error",
    });
  }
};

exports.addAboutDetails = async (req, res) => {
  try {
    await About.create(req.body);
    return res.redirect(`/hab/admin/hostel/about`);
  } catch (err) {
    console.error(err.message);
    return res.json({
      message: err.message,
      type: "database connection error",
    });
  }
};

//HMC Controllers
exports.getDetails = async (req, res) => {
  try {
    // res.render("../views/admin/hmc/index");
    hostel = req.user.hostel;
    hmcDetail.find({ hostel }).exec((err, hmcdetails) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("hostelAdmin/hmc/index", {
          hmcdetails,
          hostel,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.redirect("/hab/admin");
  }
};

exports.postDetails = async (req, res) => {
  try {
    const detail = new hmcDetail({
      name: req.body.name,
      post: req.body.post,
      image: req.file.filename,
      contno: req.body.contno,
      roomno: req.body.roomno,
      email: req.body.email,
      priono: req.body.priono,
      hostel: req.user.hostel,
    });
    detail.save((err) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        res.redirect(`/hab/admin/hostel/hmc`);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getEditDetails = async (req, res) => {
  try {
    const id = req.params.id;
    hmcDetail.findById(id, (err, detail) => {
      if (err) {
        res.redirect("/");
      } else {
        if (detail == null) {
          res.redirect("/");
        } else {
          res.render("hostelAdmin/hmc/edit", {
            detail: detail,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editDetails = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/details_img" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  hmcDetail.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      post: req.body.post,
      image: req.file.filename,
      contno: req.body.contno,
      roomno: req.body.roomno,
      email: req.body.email,
      priono: req.body.priono,
      hostel: req.params.hostelName,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect(`/hab/admin/hostel/hmc`);
      }
    }
  );
};

exports.deleteDetails = async (req, res) => {
  const id = req.params.id;
  hmcDetail.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/details_img/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      res.redirect(`/hab/admin/hostel/hmc`);
    }
  });
};

exports.getWeb = async (req, res) => {
  personalweb.find().exec((err, personalwebs) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("hostelAdmin/personalweb/index", {
        personalwebs: personalwebs,
      });
    }
  });
};

exports.getEditWeb = async (req, res) => {
  const id = req.params.id;
  personalweb.findById(id, (err, detail) => {
    if (err) {
      res.redirect("/");
    } else {
      if (detail == null) {
        res.redirect("/");
      } else {
        res.render("hostelAdmin/personalweb/add", {
          detail: detail,
        });
      }
    }
  });
};

exports.editWeb = async (req, res) => {
  const id = req.params.id;

  personalweb.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      link: req.body.link,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.redirect(`/hab/admin/hostel/personalweb`);
      }
    }
  );
};

//Notice Controllers
const Notice = require("../models/notice");

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({});
    const categories = await Category.find({});

    notices.sort(compare);
    return res.render("admin/notice/index", { notices, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addNoticeForm = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.render("admin/notice/add", { categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.postNotice = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;
    if (!path) {
      req.flash("error", "Please attach your pdf!!");
      return res.redirect("/admin/notice/add");
    }
    //console.log(path);
    const newNotice = await new Notice({
      title,
      description,
      category: name,
      path,
    }).save();
    if (!newNotice) {
      req.flash("error", "Unable to add new notice");
      res.redirect("/admin/notice/add");
    }
    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }
    req.flash("success", "Successfully added new notice");
    return res.redirect("/admin/notice");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.notice_id);
    const categories = await Category.find({});

    return res.render("admin/notice/edit", { notice, categories });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editNotice = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;
    let name = category.toLowerCase();

    const path = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = { title, description, category: name };
    } else {
      data = { title, description, path, category: name };
    }

    const savedCategory = await Category.find({ name: name });

    if (savedCategory.length == 0) {
      const newCategory = new Category({ name });
      await newCategory.save();
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.notice_id,
      data
    );

    if (!updatedNotice) {
      req.flash("error", "Unable to edit notice");
      return res.redirect("/admin/notice");
    }
    req.flash("success", "Successfully editted notice");
    return res.redirect("/admin/notice");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneNotice = async (req, res) => {
  try {
    const id = req.params.notice_id;
    const notice = await Notice.findById(id);
    const filePath = "uploads/notice_pdf/" + notice.path;
    console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const id = req.params.notice_id;
    const notice = await Notice.findById(id);
    if (notice.path.indexOf("https://") == -1) {
      fs.unlinkSync(`uploads/notice_pdf/${notice.path}`);
      console.log("successfully deleted!");
    }
    await Notice.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted notice");
    return res.redirect("/admin/notice");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/notice");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
