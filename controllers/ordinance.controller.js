const Ordinance = require("../models/ordinance");

exports.getOrdinance = async (req, res) => {
  try {
    let ordinance = await Ordinance.find({});

    if (ordinance.length == 0) {
      const newOrdinance = new Ordinance();
      await newOrdinance.save();
      ordinance = await Ordinance.find({});
    }
    return res.render("ordinance/index", { ordinance: ordinance[0] });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/admin");
  }
};

exports.editOrdinance = async (req, res) => {
  try {
    const id = req.params.ordinance_id;
    console.log(req.body);
    const ordinance = await Ordinance.findByIdAndUpdate(id, {
      path: req.body.path,
    });
    return res.redirect("/admin/ordinance");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/admin");
  }
};
