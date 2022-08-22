const mongoose = require("mongoose");
const mongoose = require("mongoose-slug-generator");

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: String },
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
