var express = require("express");
var router = express.Router();
var { isUserLogged } = require("../middleware/auth");

const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");

// article Listing Page
router.get("/", function (req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articles", { articles });
  });
});

// create form article
router.get("/new", isUserLogged, function (req, res, next) {
  res.render("createArticle");
});
// article Details Page
router.get("/:slug", function (req, res, next) {
  let slug = req.params.slug;
  Article.findOne({ slug })
    /* Populating the comments field of the article with the actual comment objects. */
    .populate("author")
    .populate({
      path: "comments",
      model: "Comment",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .exec((err, article) => {
      if (err) return next(err);
      console.log(article);
      if (article) {
        return res.render("singleArticle", { article });
      } else {
        return res.render("404");
      }
    });
});

router.use(isUserLogged);
// save article
router.post("/", function (req, res, next) {
  req.body.author = req.user._id;
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/");
  });
});
// edit form article
router.get("/:id/edit", function (req, res, next) {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("editArticle", { article });
  });
});
// update article
router.post("/:id", function (req, res, next) {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + article.slug);
  });
});
// delete article
router.get("/:id/delete", function (req, res, next) {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/");
  });
});
// like article
router.get("/:id/like", function (req, res, next) {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + article.slug);
  });
});
// dislike article
router.get("/:id/dislike", function (req, res, next) {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + article.slug);
  });
});
// add comment
router.post("/:id/comment", function (req, res, next) {
  let id = req.params.id;
  req.body.author = req.user._id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + article.slug);
      }
    );
  });
});

module.exports = router;
