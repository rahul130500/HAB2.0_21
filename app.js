const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const url = "mongodb://localhost/HAB_DB";
const app = express();
const PORT = process.env.PORT || 8080;

require("./config/passport")(passport);

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const noticeRoutes = require("./routes/notice.routes");
const functionaryRoutes = require("./routes/functionary.routes");
const announcementRoutes = require("./routes/announcement.routes");
const hostelRoutes = require("./routes/hostel.routes");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "Once again rusty is the cutest dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.set("view engine", "ejs");

app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/notice", noticeRoutes);
app.use("/announcement", announcementRoutes);
app.use("/functionary", functionaryRoutes);
app.use("/hostels", hostelRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
