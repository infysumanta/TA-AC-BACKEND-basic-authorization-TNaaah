var express = require("express");
var router = express.Router();
var { isUserLogged } = require("../middleware/auth");
const User = require("../models/User");
const Podcast = require("../models/Podcast");

router.get("/register", function (req, res, next) {
  let error = req.flash("error")[0];
  res.render("register", { error });
});

router.post("/register", function (req, res, next) {
  let { email, password } = req.body;
  if (password.length <= 5) {
    req.flash("error", "Password must be at least 6 characters long");
    return res.redirect("/users/register");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash("error", "Email already exists");
      return res.redirect("/users/register");
    } else {
      User.create(req.body, (err, user) => {
        if (err) return next(err);
        req.flash("success", "You are registered, Now login");
        res.redirect("/users/login");
      });
    }
  });
});

router.get("/login", (req, res, next) => {
  let error = req.flash("error")[0];
  res.render("login", { error });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Enter Email and Password");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Email is not Registered");
      return res.redirect("/users/login");
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) {
        req.flash("error", "Password Incorrect");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      res.redirect("/users");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

router.get("/", isUserLogged, function (req, res, next) {
  if (req.user.type == "admin") {
    Podcast.find({})
      .populate("author")
      .exec((err, podcasts) => {
        if (err) return next(err);
        res.render("user", { podcasts });
      });
  } else {
    if (req.user.subscription == "Free") {
      Podcast.find({
        subscriptionType: "Free",
      })
        .populate("author")
        .exec((err, podcasts) => {
          if (err) return next(err);
          res.render("user", { podcasts });
        });
    } else if (req.user.subscription == "VIP") {
      Podcast.find({
        subscriptionType: { $in: ["Free", "VIP"] },
      })
        .populate("author")
        .exec((err, podcasts) => {
          if (err) return next(err);
          res.render("user", { podcasts });
        });
    } else {
      Podcast.find({})
        .populate("author")
        .exec((err, podcasts) => {
          if (err) return next(err);
          res.render("user", { podcasts });
        });
    }
  }
});

module.exports = router;
