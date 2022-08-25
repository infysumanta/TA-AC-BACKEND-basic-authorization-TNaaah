var express = require("express");
var router = express.Router();
const Podcast = require("../models/Podcast");
/* GET home page. */
router.get("/podcast/", function (req, res, next) {
  res.render("index", { title: "podcast list" });
});

router.get("/podcast/new", function (req, res, next) {
  let error = req.flash("error")[0];
  res.render("createAdminPodcast", { error: error });
});

router.post("/podcast/save", function (req, res, next) {
  req.body.author = req.user._id;
  req.body.verified = true;
  console.log(req.body);
  Podcast.create(req.body, (err, podcast) => {
    if (err) return next(err);
    res.redirect("/users/");
  });
});

module.exports = router;
