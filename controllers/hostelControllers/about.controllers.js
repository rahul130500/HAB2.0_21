//Check the hostelprofile.controller file this file is not in use

const About = require("../../models/hostelModels/about.models");

module.exports.getAboutDetails = async (req, res) => {
    try {
        const aboutdetails = await About.find({}).sort({_id:-1}).limit(1);
        return res.render("../../views/hostelAdmin/about/index", { aboutdetails });
    } catch (err) {
        console.error(err);
        return res.json({ message: err.message, type: "database connection error" });
    }
};

module.exports.addAboutDetails = async (req, res) => {
	try {
		await About.create(req.body);
		return res.redirect("/hab/admin/hostel/:hostelName/about");
	} catch (err) {
		console.error(err.message);
		return res.json({ message: err.message, type: "database connection error" });
	}
};
