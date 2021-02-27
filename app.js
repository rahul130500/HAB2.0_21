const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const helmet = require("helmet");
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
const formRoutes = require("./routes/form.routes");
const hostelRoutes = require("./routes/hostel.routes");
const adminUploadRoutes = require("./routes/adminUploads.routes");
const linkRoutes = require("./routes/link.routes");

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(
  session({
    secret: "Once again rusty is the cutest dog",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.set("view engine", "ejs");

app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/notice", noticeRoutes);
app.use("/admin/announcement", announcementRoutes);
app.use("/admin/functionary", functionaryRoutes);
app.use("/admin/hostels", hostelRoutes);
app.use("/admin/uploads", adminUploadRoutes);
app.use("/admin/form", formRoutes);
app.use("/admin/links", linkRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
