const Link = require("../models/link");

exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find({});
    return res.render("links/index", { links });
  } catch (err) {
    console.log(err.msg);
  }
};

exports.addLinkForm = async (req, res) => {
  try {
    return res.render("links/add");
  } catch (error) {
    console.log(err.msg);
  }
};

exports.postLink = async (req, res) => {
  try {
    const { name, priority_number } = req.body;
    const data = { name, priority_number: Number(priority_number) };
    const newLink = new Link(data);
    await newLink.save();
    return res.redirect("/links");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditForm = async (req, res) => {
  try {
    const link = await Link.findById(req.params.link_id);
    return res.render("links/edit", { link });
  } catch (error) {
    console.log(error.message);
  }
};

exports.editLink = async (req, res) => {
  try {
    const { name, priority_number } = req.body;
    const update = { name, priority_number: Number(priority_number) };
    await Link.findByIdAndUpdate(req.params.link_id, update);
    return res.redirect("/links");
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteLink = async (req, res) => {
  try {
    await Link.findByIdAndRemove(req.params.link_id);
    res.redirect("/links");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAllSublinks = async (req, res) => {
  try {
    const link_id = req.params.link_id;
    const link = await Link.findById(link_id);
    const sublinks = link.sublinks;
    return res.render("links/sublinks/index", { link, sublinks });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addSublinkForm = async (req, res) => {};
exports.postSublink = async (req, res) => {};
exports.getSublinkEditForm = async (req, res) => {};
exports.editSublink = async (req, res) => {};
exports.deleteSublink = async (req, res) => {};
