var express = require("express");
var router = express.Router();
var { isUserLogged } = require("../middleware/auth");

const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");

router.use(isUserLogged);

router.post("/:id", function (req, res, next) {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body)
    .populate("articleId")
    .exec((err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId.slug);
    });
});

router.get("/:id/delete", function (req, res, next) {
  let id = req.params.id;
  Comment.findByIdAndDelete(id)
    .populate("articleId")
    .exec((err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId.slug);
    });
});
router.get("/:id/dislike", function (req, res, next) {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } })
    .populate("articleId")
    .exec((err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId.slug);
    });
});
router.get("/:id/like", function (req, res, next) {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } })
    .populate("articleId")
    .exec((err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId.slug);
    });
});

router.get("/:id/edit", function (req, res, next) {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render("editComment", { comment });
  });
});
module.exports = router;
