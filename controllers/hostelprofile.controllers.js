const About = require("../models/hostelModels/about.models");
const hmcDetail = require("../models/hostelModels/hmc.models");
const fs = require("fs");
const Mess = require("../models/hostelModels/mess");
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
// exports.getDetails = async (req, res) => {
//   try {
//     // res.render("../views/admin/hmc/index");
//     hostel = req.user.hostel;
//     hmcDetail.find({ hostel }).exec((err, hmcdetails) => {
//       if (err) {
//         res.json({ message: err.message });
//       } else {
//         res.render("hostelAdmin/hmc/index", {
//           hmcdetails,
//           hostel,
//         });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.redirect("/hab/admin");
//   }
// };

// exports.postDetails = async (req, res) => {
//   try {
//     const detail = new hmcDetail({
//       name: req.body.name,
//       post: req.body.post,
//       image: req.file.filename,
//       contno: req.body.contno,
//       roomno: req.body.roomno,
//       email: req.body.email,
//       priono: req.body.priono,
//       hostel: req.user.hostel,
//     });
//     detail.save((err) => {
//       if (err) {
//         res.json({ message: err.message, type: "danger" });
//       } else {
//         res.redirect(`/hab/admin/hostel/hmc`);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.getEditDetails = async (req, res) => {
//   try {
//     const id = req.params.id;
//     hmcDetail.findById(id, (err, detail) => {
//       if (err) {
//         res.redirect("/");
//       } else {
//         if (detail == null) {
//           res.redirect("/");
//         } else {
//           res.render("hostelAdmin/hmc/edit", {
//             detail: detail,
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.editDetails = async (req, res) => {
//   const id = req.params.id;
//   let new_image = "";

//   if (req.file) {
//     new_image = req.file.filename;
//     try {
//       fs.unlinkSync("./uploads/hostel_files/" + req.body.old_image);
//     } catch (err) {
//       console.log("");
//       console.log(err);
//     }
//   } else {
//     new_image = req.body.old_image;
//   }
//   hmcDetail.findByIdAndUpdate(
//     id,
//     {
//       name: req.body.name,
//       post: req.body.post,
//       image: req.file.filename,
//       contno: req.body.contno,
//       roomno: req.body.roomno,
//       email: req.body.email,
//       priono: req.body.priono,
//       hostel: req.user.hostel,
//     },
//     (err, result) => {
//       if (err) {
//         res.json({ message: err.message });
//       } else {
//         res.redirect(`/hab/admin/hostel/hmc`);
//       }
//     }
//   );
// };

// exports.deleteDetails = async (req, res) => {
//   const id = req.params.id;
//   hmcDetail.findByIdAndRemove(id, (err, result) => {
//     if (result.image != "") {
//       try {
//         fs.unlinkSync("./uploads/details_img/" + result.image);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     if (err) {
//       res.json({ message: err.message });
//     } else {
//       res.redirect(`/hab/admin/hostel/hmc`);
//     }
//   });
// };

exports.getWeb = async (req, res) => {
  personalweb.find({ hostel: req.user.hostel }).exec((err, personalwebs) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("hostelAdmin/personalweb/index", {
        personalwebs: personalwebs,
      });
    }
  });
};

exports.addpersonalweb = async (req, res) => {
  try {
    const link = req.body.link;
    const website = await new personalweb({
      hostel: req.user.hostel,
      link,
    }).save();
    res.redirect("/hab/admin/hostel/personalweb");
  } catch (error) {
    console.log(error);
    res.redirect("/hab/admin/hostel/personalweb");
  }
};

exports.getEditWeb = async (req, res) => {
  const id = req.params.id;
  personalweb.findById(id, (err, detail) => {
    if (err) {
      res.redirect("/hab/admin/hostel");
    } else {
      if (detail == null) {
        res.redirect("/hab/admin/hostel");
      } else {
        res.render("hostelAdmin/personalweb/edit", {
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
      hostel: req.user.hostel,
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

exports.deleteWeb = async (req, res) => {
  try {
    await personalweb.findByIdAndRemove(req.params.id);
    res.redirect("/hab/admin/hostel/personalweb");
  } catch (error) {
    console.log(error);
    res.redirect("/hab/admin/hostel/personalweb");
  }
};

//Notice Controllers
const Notice = require("../models/hostelModels/notice");

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ hostel: req.user.hostel });
    notices.sort(compare);
    return res.render("hostelAdmin/notice/index", { notices });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addNoticeForm = async (req, res) => {
  try {
    return res.render("hostelAdmin/notice/add");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postNotice = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;

    const path = req.file ? req.file.filename : link;
    if (!path) {
      req.flash("error", "Please attach your pdf!!");
      return res.redirect("/hab/admin/hostel/notice/add");
    }
    //console.log(path);
    const newNotice = await new Notice({
      title,
      description,
      category,
      path,
      hostel: req.user.hostel,
    }).save();
    if (!newNotice) {
      req.flash("error", "Unable to add new notice");
      res.redirect("/hab/admin/hostel/notice/add");
    }
    req.flash("success", "Successfully added new notice");
    return res.redirect("/hab/admin/hostel/notice");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.notice_id);

    return res.render("hostelAdmin/notice/edit", { notice });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editNotice = async (req, res) => {
  try {
    var { title, description, category, link } = req.body;

    const path = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = { title, description, category, hostel: req.user.hostel };
    } else {
      data = {
        title,
        description,
        path,
        category,
        hostel: req.user.hostel,
      };
    }
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.notice_id,
      data
    );

    if (!updatedNotice) {
      req.flash("error", "Unable to edit notice");
      return res.redirect("/hab/admin/hostel/notice");
    }
    req.flash("success", "Successfully editted notice");
    return res.redirect("/hab/admin/hostel/notice");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneNotice = async (req, res) => {
  try {
    const id = req.params.notice_id;
    const notice = await Notice.findById(id);
    const filePath = "uploads/hostel_files/" + notice.path;
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
      fs.unlinkSync(`uploads/hostel_files/${notice.path}`);
      console.log("successfully deleted!");
    }
    await Notice.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted notice");
    return res.redirect("/hab/admin/hostel/notice");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/hostel/notice");
  }
};

// Event Controllers
const Event = require("../models/hostelModels/event");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ hostel: req.user.hostel });
    events.sort(compare);
    return res.render("hostelAdmin/event/index", { events });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addEventForm = async (req, res) => {
  try {
    return res.render("hostelAdmin/event/add");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postEvent = async (req, res) => {
  try {
    var { name, imagepath, date, link } = req.body;

    const path = req.file ? req.file.filename : link;
    if (!path) {
      req.flash("error", "Please attach your pdf!!");
      return res.redirect("/hab/admin/hostel/event/add");
    }
    //console.log(path);
    const newEvent = await new Event({
      name,
      imagepath,
      date,
      path,
      hostel: req.user.hostel,
    }).save();
    if (!newEvent) {
      req.flash("error", "Unable to add new event");
      res.redirect("/hab/admin/hostel/event/add");
    }
    req.flash("success", "Successfully added new event");
    return res.redirect("/hab/admin/hostel/event");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.event_id);

    return res.render("hostelAdmin/event/edit", { event });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editEvent = async (req, res) => {
  try {
    var { name, imagepath, date, link } = req.body;

    const path = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = { name, imagepath, date, hostel: req.user.hostel };
    } else {
      data = {
        name,
        imagepath,
        date,
        path,
        hostel: req.user.hostel,
      };
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.event_id,
      data
    );

    if (!updatedEvent) {
      req.flash("error", "Unable to edit event");
      return res.redirect("/hab/admin/hostel/event");
    }
    req.flash("success", "Successfully editted event");
    return res.redirect("/hab/admin/hostel/event");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneEvent = async (req, res) => {
  try {
    const id = req.params.event_id;
    const event = await Event.findById(id);
    const filePath = "uploads/hostel_files/" + event.path;
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const id = req.params.event_id;
    const event = await Event.findById(id);
    if (event.path.indexOf("https://") == -1) {
      fs.unlinkSync(`uploads/hostel_files/${event.path}`);
      console.log("successfully deleted!");
    }
    await Event.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted event");
    return res.redirect("/hab/admin/hostel/event");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/hostel/event");
  }
};

//HMC Controllers

const HmcDetail = require("../models/hostelModels/hmc.models");

exports.getHmcDetails = async (req, res) => {
  try {
    const details = await HmcDetail.find({ hostel: req.user.hostel });
    details.sort(compare);
    return res.render("hostelAdmin/hmc/index", { details });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addHmcForm = async (req, res) => {
  try {
    return res.render("hostelAdmin/hmc/add");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postHmcDetails = async (req, res) => {
  try {
    var { name, post, contno, roomno, email, priono, link } = req.body;

    const image = req.file ? req.file.filename : link;
    if (!image) {
      req.flash("error", "Please attach your pdf!!");
      return res.redirect("/hab/admin/hostel/hmc/add");
    }
    //console.log(path);
    const newHmcDetail = await new HmcDetail({
      name,
      post,
      contno,
      roomno,
      email,
      priono,
      image,
      hostel: req.user.hostel,
    }).save();
    if (!newHmcDetail) {
      req.flash("error", "Unable to add new Detail");
      res.redirect("/hab/admin/hostel/hmc/add");
    }
    req.flash("success", "Successfully added new detail");
    return res.redirect("/hab/admin/hostel/hmc");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditHmcDetailsForm = async (req, res) => {
  try {
    const details = await HmcDetail.findById(req.params.details_id);

    return res.render("hostelAdmin/hmc/edit", { details });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editHmcDetail = async (req, res) => {
  try {
    var { name, post, contno, roomno, email, priono, link } = req.body;

    const image = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = {
        name,
        post,
        contno,
        roomno,
        email,
        priono,
        hostel: req.user.hostel,
      };
    } else {
      data = {
        name,
        post,
        contno,
        roomno,
        email,
        priono,
        image,
        hostel: req.user.hostel,
      };
    }
    const updatedHmcDetail = await HmcDetail.findByIdAndUpdate(
      req.params.details_id,
      data
    );

    if (!updatedHmcDetail) {
      req.flash("error", "Unable to edit detail");
      return res.redirect("/hab/admin/hostel/hmc");
    }
    req.flash("success", "Successfully editted detail");
    return res.redirect("/hab/admin/hostel/hmc");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneHmcDetail = async (req, res) => {
  try {
    const id = req.params.details_id;
    const details = await HmcDetail.findById(id);
    const filePath = "uploads/hostel_files/" + details.image;
    fs.readFile(filePath, (err, data) => {
      res.contentType("application/pdf");
      return res.send(data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

// exports.deleteHmcDetail = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const details = await HmcDetail.findById(id);
//     if (details.image.indexOf("https://") == -1) {
//       fs.unlinkSync(`uploads/hostel_files/${details.image}`)
//       console.log("successfully deleted!");
//     }

//     await HmcDetail.findByIdAndDelete(id);
//     req.flash("success", "Successfully deleted detail");
//     return res.redirect("/hab/admin/hostel/hmc");
//   } catch (err) {
//     // handle the error
//     console.log(err);
//     return res.redirect("/hab/admin/hostel/hmc");
//   }
// };

exports.deleteHmcDetail = async (req, res) => {
  const id = req.params.details_id;
  HmcDetail.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/hostel_files/" + result.image);
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

//Form Controller

exports.getMessInfo = async (req, res) => {
  try {
    const mess = await Mess.find({ hostel: req.user.hostel });

    mess.sort(compare);
    return res.render("hostelAdmin/mess/index", { mess });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addMessForm = async (req, res) => {
  try {
    return res.render("hostelAdmin/mess/add");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postMess = async (req, res) => {
  try {
    var { title, number, link } = req.body;

    const path = req.file ? req.file.filename : link;
    if (!path) {
      req.flash("error", "Please attach your pdf!!");
      return res.redirect("/hab/admin/hostel/form/add");
    }
    //console.log(path);
    const newMess = await new Mess({
      title,
      number,
      path,
      hostel: req.user.hostel,
    }).save();
    if (!newMess) {
      req.flash("error", "Unable to add new mess data");
      res.redirect("/hab/admin/hostel/form/add");
    }
    req.flash("success", "Successfully added new mess data");
    return res.redirect("/hab/admin/hostel/form");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getMessEditForm = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.mess_id);

    return res.render("hostelAdmin/mess/edit", { mess });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editMess = async (req, res) => {
  try {
    var { title, number, link } = req.body;

    const path = req.file ? req.file.filename : link;
    let data;
    if (!req.file && !link) {
      data = { title, number, hostel: req.user.hostel };
    } else {
      data = { title, number, path, hostel: req.user.hostel };
    }

    const updatedMess = await Mess.findByIdAndUpdate(req.params.mess_id, data);

    if (!updatedMess) {
      req.flash("error", "Unable to edit mess data");
      return res.redirect("/hab/admin/hostel/form");
    }
    req.flash("success", "Successfully editted mess data");
    return res.redirect("/hab/admin/hostel/form");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getOneMess = async (req, res) => {
  try {
    const id = req.params.mess_id;
    const mess = await Mess.findById(id);
    const filePath = "uploads/hostel_files/" + mess.path;
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
      fs.unlinkSync(`uploads/hostel_files/${mess.path}`);
      console.log("successfully deleted!");
    }
    await Mess.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted mess data");
    return res.redirect("/hab/admin/hostel/form");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/hostel/form");
  }
};

const compare = (a, b) => {
  return b.creation - a.creation;
};
