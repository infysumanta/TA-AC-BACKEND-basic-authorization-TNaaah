var express = require("express");
var router = express.Router();
const Podcast = require("../models/Podcast");
/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.user.type == "admin") {
    Podcast.find({})
      .populate("author")
      .exec((err, podcasts) => {
        if (err) return next(err);
        res.render("podcasts", { podcasts });
      });
  } else {
    Podcast.find({ author: req.user._id })
      .populate("author")
      .exec((err, podcasts) => {
        if (err) return next(err);
        res.render("podcasts", { podcasts });
      });
  }
});
router.get("/new", function (req, res, next) {
  let error = req.flash("error")[0];
  res.render("createPodcast", { error: error });
});

router.post("/save", function (req, res, next) {
  req.body.author = req.user._id;
  req.body.verified = false;
  req.body.subscriptionType = "Free";
  Podcast.create(req.body, (err, podcast) => {
    if (err) return next(err);
    res.redirect("/users/");
  });
});

router.get("/verified/:flag", (req, res, next) => {
  let flag = req.params.flag == "true" ? true : false;
  Podcast.findByIdAndUpdate({ verified: flag }, (err, podcast) => {
    if (err) return next(err);
    res.redirect("/users/");
  });
});

module.exports = router;
