const Hostel = require("../models/hostel");
const fs = require("fs");

exports.getAllHostels = async (req, res, next) => {
  const hostels = await Hostel.find({});

  return res.render("hostels/index", { hostels, link: "/hostels/addHostel" });
};

exports.getHostel = async (req, res, next) => {
  const id1 = req.params.id1;
  const hostel = await Hostel.findById(id1);
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/hab/admin/hostels");
  }

  if (hostel == null) {
    return res.status(404).json({
      status: "not found",
      data: {
        data: hostel,
      },
    });
  }
  const name = hostel.name;
  const members = hostel.management;
  members.sort((a, b) => (a.priority > b.priority ? 1 : -1));

  return res.render("hostels/members/index", {
    members,
    link: "/hostels/" + id1 + "/addMember",
    id1,
    name,
  });
};

exports.addHostelForm = (req, res) => {
  return res.render("hostels/add", { link: "/hostels" });
};

exports.createHostel = async (req, res) => {
  var { name, description } = req.body;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  var pic;
  if (req.file) pic = req.file.filename;
  const newHostel = await new Hostel({
    name,
    pic,
    description,
  }).save();
  if (!newHostel) {
    req.flash("error", "Cannot add hostel");
    return res.redirect("/hab/admin/hostels");
  }
  req.flash("success", "Successfully added new hostel");
  return res.redirect("/hab/admin/hostels");
};

exports.updateHostelForm = async (req, res) => {
  const id1 = req.params.id1;
  const hostel = await Hostel.findById(id1);
  if (!hostel) {
    req.flash("error", "Cannot find this hostel");
    return res.redirect("/hab/admin/hostels");
  }

  return res.render("hostels/edit", {
    link: "/hab/admin/hostels/" + id1,
    hostel,
  });
};

exports.updateHostel = async (req, res) => {
  const id1 = req.params.id1;
  const hostel = await Hostel.findById(id1);
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/hab/admin/hostels");
  }

  var name = hostel.name;
  var pic = hostel.pic;
  var description = hostel.description;

  if (req.body.name) {
    name = req.body.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  if (req.file) {
    fs.unlinkSync(`uploads/hostel/${hostel.pic}`);
    pic = req.file.filename;
  }
  if (req.body.description) {
    description = req.body.description;
  }
  const obj = { name, pic, description };
  const hostell = await Hostel.findByIdAndUpdate(id1, obj, {
    runValidators: true,
  });
  if (!hostell) {
    req.flash("error", "Cannot add hostel");
    return res.redirect("/hab/admin/hostels");
  }
  req.flash("success", "Successfully updated hostel");

  return res.redirect("/hab/admin/hostels");
};

exports.addMemberForm = (req, res) => {
  const id1 = req.params.id1;

  return res.render("hostels/members/add", { link: "/hostels/" + id1, id1 });
};

exports.createMember = async (req, res, next) => {
  const { Mname, position, priority, contact1, contact2, email } = req.body;
  const id1 = req.params.id1;

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
  const hostel = Hostel.findByIdAndUpdate(
    id1,
    { $push: { management: member } },
    function (error) {
      if (error) {
        console.log(error);
      }
    }
  );
  if (!hostel) {
    req.flash("error", "Cannot add member");
    return res.redirect(`/hab/admin/hostels/${id1}`);
  }
  req.flash("success", "Successfully added new member");

  return res.redirect(`/hab/admin/hostels/${id1}/addMember`);
};

exports.updateMemberForm = async (req, res) => {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  const hostel = await Hostel.findById(id1);
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/hab/admin/hostels");
  }

  var member = hostel.management;
  member = member.filter(function (object) {
    return object.id == id2;
  });
  mb = member[0];
  if (!mb) {
    req.flash("error", "Cannot find member");
    return res.redirect(`/hab/admin/hostels/${id1}`);
  }

  return res.render("hostels/members/edit", {
    link: "/hab/admin/hostels/" + id1 + "/" + id2,
    mb,
    id1,
  });
};

exports.updateMember = async (req, res) => {
  const id1 = req.params.id1;

  const hostel = await Hostel.findById(id1);
  if (!hostel) {
    req.flash("error", "Cannot find hostel");
    return res.redirect("/hab/admin/hostels");
  }

  const { Mname, position, priority, contact1, contact2, email } = req.body;
  const id2 = req.params.id2;
  var member = hostel.management;
  member = member.filter(function (object) {
    return object.id == id2;
  });
  if (!member) {
    req.flash("error", "Cannot find member");
    return res.redirect(`/hab/admin/hostels/${name}`);
  }
  var photo = member[0].photo;

  if (req.file) {
    if (member[0].photo) {
      fs.unlinkSync(`uploads/hostel/${member[0].photo}`);
      console.log("successfully deleted /tmp/hello");
    }
    photo = req.file.filename;
  }

  const hostell = await Hostel.findById(id1).then((hostel) => {
    let management = hostel.management.id(id2);
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
    return res.redirect("/hab/admin/hostels/" + id1);
  }
  req.flash("success", "Successfully updated member");
  return res.redirect("/hab/admin/hostels/" + id1);
};

exports.deleteMember = async (req, res) => {
  try {
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const hostel = await Hostel.findById(id1);
    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/hab/admin/hostels");
    }
    var member = hostel.management;
    member = member.filter(function (object) {
      return object.id == id2;
    });
    if (!member) {
      req.flash("error", "Cannot find member");
      return res.redirect("/hab/admin/hostels" + id1);
    }

    if (member[0].photo) {
      fs.unlinkSync(`uploads/hostel/${member[0].photo}`);
      console.log("successfully deleted /tmp/hello");
    }
    hostel.management.pull({ _id: id2 });
    await hostel.save();
    req.flash("success", "Successfully deleted member");
    return res.redirect("/hab/admin/hostels/" + id1);
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/hostels/" + req.params.id1);
  }
};

exports.deleteHostelMembers = async (req, res) => {
  try {
    const id1 = req.params.id1;
    const hostel = await Hostel.findById(id1);
    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/hab/admin/hostels");
    }
    var members = hostel.management;
    if (!members) {
      req.flash("error", "Cannot find members");
      return res.redirect("/hab/admin/hostels/" + id1);
    }
    members.forEach((member) => {
      if (member.photo) fs.unlinkSync(`uploads/hostel/${member.photo}`);
    });
    hostel.management.splice(0, hostel.management.length);
    await hostel.save();
    req.flash("success", "Successfully deleted all members");
    console.log("successfully deleted all members");

    return res.redirect("/hab/admin/hostels/" + id1);
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/hostels/" + req.params.id1);
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    const id1 = req.params.id1;
    const hostel = await Hostel.findById(id1);
    if (!hostel) {
      req.flash("error", "Cannot find hostel");
      return res.redirect("/hab/admin/hostels");
    }
    fs.unlinkSync(`uploads/hostel/${hostel.pic}`);
    var members = hostel.management;
    members.forEach((member) => {
      if (member.photo) fs.unlinkSync(`uploads/hostel/${member.photo}`);
    });

    console.log("successfully deleted!");
    await Hostel.findByIdAndRemove(id1);
    req.flash("success", "Successfully deleted hostel");

    return res.redirect("/hab/admin/hostels");
  } catch (err) {
    // handle the error
    console.log(err);
    return res.redirect("/hab/admin/hostels");
  }
};
