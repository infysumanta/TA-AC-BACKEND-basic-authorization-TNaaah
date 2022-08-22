var express = require("express");
var router = express.Router();
var { isUserLogged } = require("../middleware/auth");
// article Listing Page
router.get("/", function (req, res, next) {});
// article Details Page
router.get("/:slug", function (req, res, next) {});

router.use(isUserLogged);
// create form article
router.get("/new", function (req, res, next) {});
// save article
router.post("/", function (req, res, next) {});
// edit form article
router.post("/:id/edit", function (req, res, next) {});
// update article
router.post("/:id", function (req, res, next) {});
// delete article
router.post("/:id/delete", function (req, res, next) {});
// like article
router.get("/:id/like", function (req, res, next) {});
// dislike article
router.get("/:id/dislike", function (req, res, next) {});
// add comment
router.post("/:id/comment", function (req, res, next) {});

module.exports = router;
