const Hostel = require("../models/hostel");
const fs = require("fs");

exports.getAllHostels = async (req, res, next) => {
  const hostels = await Hostel.find({});

  return res.render("hostels/index", { hostels, link: "/hostels/addHostel" });
};

exports.getHostel = async (req, res, next) => {
  const hostel = await Hostel.findOne({ name: req.params.name });
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/admin/hostels");
  }

  if (hostel == null) {
    return res.status(404).json({
      status: "not found",
      data: {
        data: hostel,
      },
    });
    next();
  }
  const name = req.params.name;
  const members = hostel.management;
  members.sort((a, b) => (a.priority > b.priority ? 1 : -1));

  return res.render("hostels/members/index", {
    members,
    link: "/hostels/" + name + "/addMember",
    name,
  });
};

exports.addHostelForm = (req, res) => {
  return res.render("hostels/add", { link: "/hostels" });
};

exports.createHostel = async (req, res) => {
  var { name, contact1, contact2 } = req.body;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  var pic;
  if (req.file) pic = req.file.filename;
  const newHostel = new Hostel({ name, pic, contact1, contact2 });

  const hostel = await newHostel.save();
  if (!hostel) {
    req.flash("error", "Cannot add hostel");
    return res.redirect("/admin/hostels");
  }
  req.flash("success", "Successfully added new hostel");
  return res.redirect("/admin/hostels");
};

exports.updateHostelForm = async (req, res) => {
  const hostel = await Hostel.findOne({ name: req.params.name });
  if (!hostel) {
    req.flash("error", "Cannot find this hostel");
    return res.redirect("/admin/hostels");
  }

  return res.render("hostels/edit", {
    link: "/admin/hostels/" + req.params.name,
    hostel,
  });
};

exports.updateHostel = async (req, res) => {
  const hostel = await Hostel.findOne({ name: req.params.name });
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/admin/hostels");
  }

  var name = hostel.name;
  var pic = hostel.pic;
  var contact1 = hostel.contact1;
  var contact2 = hostel.contact2;

  if (req.body.name) {
    name = req.body.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  if (req.file) {
    fs.unlinkSync(`uploads/hostel/${hostel.pic}`);
    pic = req.file.filename;
  }
  if (req.body.contact1) {
    contact1 = req.body.contact1;
  }
  if (req.body.contact2) {
    contact2 = req.body.contact2;
  }
  const obj = { name, pic, contact1, contact2 };
  const hostell = await Hostel.findOneAndUpdate(req.params.name, obj, {
    runValidators: true,
  });
  if (!hostell) {
    req.flash("error", "Cannot add hostel");
    return res.redirect("/admin/hostels");
  }
  req.flash("success", "Successfully updated hostel");

  return res.redirect("/admin/hostels");
};

exports.addMemberForm = (req, res) => {
  const name = req.params.name;
  return res.render("hostels/members/add", { link: "/hostels/" + name, name });
};

exports.createMember = async (req, res, next) => {
  const { Mname, position, priority, contact1, contact2, email } = req.body;
  const name = req.params.name;
  var photo;
  if (req.file) photo = req.file.filename;
  const member = {
    Mname,
    position,
    priority,
    photo,
    contact1,
    contact2,
    email,
  };
  const hostel = Hostel.findOneAndUpdate(
    { name: name },
    { $push: { management: member } },
    function (error) {
      if (error) {
        console.log(error);
      }
    }
  );
  if (!hostel) {
    req.flash("error", "Cannot add member");
    return res.redirect(`/admin/hostels/${name}`);
  }
  req.flash("success", "Successfully added new member");

  return res.redirect(`/admin/hostels/${name}`);
};

exports.updateMemberForm = async (req, res) => {
  const name = req.params.name;
  const id = req.params.id;
  const hostel = await Hostel.findOne({ name: name });
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/admin/hostels");
  }

  var member = hostel.management;
  member = member.filter(function (object) {
    return object.id == id;
  });
  mb = member[0];
  if (!mb) {
    req.flash("error", "Cannot find member");
    return res.redirect(`/admin/hostels/${name}`);
  }

  return res.render("hostels/members/edit", {
    link: "/admin/hostels/" + req.params.name + "/" + id,
    mb,
    name,
  });
};

exports.updateMember = async (req, res) => {
  const name = req.params.name;

  const hostel = await Hostel.findOne({ name: name });
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/admin/hostels");
  }

  const { Mname, position, priority, contact1, contact2, email } = req.body;
  const id = req.params.id;
  var member = hostel.management;
  member = member.filter(function (object) {
    return object.id == id;
  });
  if (!member) {
    req.flash("error", "Cannot find member");
    return res.redirect(`/admin/hostels/${name}`);
  }
  var photo = member[0].photo;

  if (req.file) {
    if (member[0].photo) {
      fs.unlinkSync(`uploads/hostel/${member[0].photo}`);
      console.log("successfully deleted /tmp/hello");
    }
    photo = req.file.filename;
  }

  const hostell = await Hostel.findOne({ name }).then((hostel) => {
    let management = hostel.management.id(id);
    management.Mname = Mname;
    management.position = position;
    management.contact1 = contact1;
    management.contact2 = contact2;
    management.email = email;
    management.priority = priority;
    management.photo = photo;
    return hostel.save();
  });
  if (!hostell) {
    req.flash("error", "Cannot update member");
    return res.redirect("/admin/hostels/" + name);
  }
  req.flash("success", "Successfully updated member");
  return res.redirect("/admin/hostels/" + name);
};

exports.deleteMember = async (req, res) => {
  try {
    const name = req.params.name;
    const id = req.params.id;
    const hostel = await Hostel.findOne({ name: name });
    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/admin/hostels");
    }
    var member = hostel.management;
    member = member.filter(function (object) {
      return object.id == id;
    });
    if (!member) {
      req.flash("error", "Cannot find member");
      return res.redirect("/admin/hostels" + name);
    }

    if (member[0].photo) {
      fs.unlinkSync(`uploads/hostel/${member[0].photo}`);
      console.log("successfully deleted /tmp/hello");
    }
    hostel.management.pull({ _id: id });
    await hostel.save();
    req.flash("success", "Successfully deleted member");
    return res.redirect("/admin/hostels/" + name);
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/hostels/" + req.params.name);
  }
};

exports.deleteHostelMembers = async (req, res) => {
  try {
    const name = req.params.name;
    const hostel = await Hostel.findOne({ name: name });
    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/admin/hostels");
    }
    var members = hostel.management;
    if (!members) {
      req.flash("error", "Cannot find members");
      return res.redirect("/admin/hostels/" + name);
    }
    members.forEach((member) => {
      if (member.photo) fs.unlinkSync(`uploads/hostel/${member.photo}`);
    });
    hostel.management.splice(0, hostel.management.length);
    await hostel.save();
    req.flash("success", "Successfully deleted all members");
    console.log("successfully deleted all members");

    return res.redirect("/admin/hostels/" + name);
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/hostels/" + req.params.name);
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    const id = req.params.id;
    const hostel = await Hostel.findById(id);
    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/admin/hostels");
    }
    fs.unlinkSync(`uploads/hostel/${hostel.pic}`);
    var members = hostel.management;
    members.forEach((member) => {
      if (member.photo) fs.unlinkSync(`uploads/hostel/${member.photo}`);
    });

    console.log("successfully deleted!");
    await Hostel.findByIdAndRemove(id);
    req.flash("success", "Successfully deleted hostel");

    return res.redirect("/admin/hostels");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/admin/hostels");
  }
};
