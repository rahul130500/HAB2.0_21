const Link = require("../models/link");

exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find({}).sort("priority");
    return res.render("links/index", { links });
  } catch (err) {
    console.log(err.message);
  }
};

exports.addLinkForm = async (req, res) => {
  try {
    return res.render("links/add");
  } catch (error) {
    console.log(err.message);
  }
};

exports.postLink = async (req, res) => {
  try {
    const { name, priority_number } = req.body;
    const data = { name, priority_number: Number(priority_number) };
    const newLink = new Link(data);
    const link = await newLink.save();
    if (!link) {
      req.flash("error", "Cannot add link");
      return res.redirect("/admin/links");
    }
    req.flash("success", "Successfully added new link");
    return res.redirect("/admin/links");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const link = await Link.findById(req.params.link_id);
    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }
    return res.render("links/edit", { link });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editLink = async (req, res) => {
  try {
    const { name, priority_number } = req.body;
    const update = { name, priority_number: Number(priority_number) };
    const link = await Link.findByIdAndUpdate(req.params.link_id, update);
    if (!link) {
      req.flash("error", "Cannot update this link");
      return res.redirect("/admin/links");
    }
    req.flash("success", "Successfully editted link");
    return res.redirect("/admin/links");
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteLink = async (req, res) => {
  try {
    await Link.findByIdAndRemove(req.params.link_id);
    req.flash("success", "Successfully deleted");
    res.redirect("/admin/links");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAllSublinks = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const link = await Link.findById(link_id);
    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }
    const sublinks = link.sublinks;
    sublinks.sort(compare);
    return res.render("links/sublinks/index", { link, sublinks });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addSublinkForm = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const link = await Link.findById(link_id);
    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }
    return res.render("links/sublinks/add", { link });
  } catch (error) {
    console.log(error.message);
  }
};

exports.postSublink = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const { name, url, priority_number } = req.body;
    const link = await Link.findById(link_id);
    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }
    const sublink = { name, url, priority_number };
    let newSublink = link.sublinks.create(sublink);
    //console.log(newSublink);
    link.sublinks.push(newSublink);
    const updatedLink = await link.save();

    if (!updatedLink) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }

    req.flash("success", "Successfully added new sublink");
    return res.redirect(`/admin/links/${link_id}/sublinks/add`);
  } catch (error) {
    console.log(error.message);
  }
};

exports.getSublinkEditForm = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const sublink_id = req.params.sublink_id;
    const link = await Link.findById(link_id);

    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }

    const sublink = link.sublinks.find((sublink) => sublink.id === sublink_id);
    if (!sublink) {
      req.flash("error", "Cannot find this sublink");
      return res.redirect(`/admin/links/${link_id}/sublinks`);
    }
    return res.render("links/sublinks/edit", { link, sublink });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editSublink = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const sublink_id = req.params.sublink_id;
    const { name, url, priority_number } = req.body;

    const link = await Link.findById(link_id);

    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }

    let sublinks = link.sublinks;

    sublinks.forEach((sublink) => {
      if (sublink.id === sublink_id) {
        sublink.name = name;
        sublink.url = url;
        sublink.priority_number = priority_number;
      }
    });
    link.sublinks = sublinks;
    await link.save();
    req.flash("success", "Successfully editted sublink");
    return res.redirect(`/admin/links/${link_id}/sublinks`);
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteSublink = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const sublink_id = req.params.sublink_id;

    const link = await Link.findById(link_id);
    if (!link) {
      req.flash("error", "Cannot find this link");
      return res.redirect("/admin/links");
    }
    let sublinks = link.sublinks;
    sublinks = sublinks.filter((sublink) => sublink.id != sublink_id);
    link.sublinks = sublinks;
    await link.save();
    req.flash("success", "Successfully deleted sublink");
    return res.redirect(`/admin/links/${link_id}/sublinks`);
  } catch (error) {
    console.log(error.message);
  }
};

const compare = (a, b) => {
  //console.log(a, b);
  return a.priority_number - b.priority_number;
};
