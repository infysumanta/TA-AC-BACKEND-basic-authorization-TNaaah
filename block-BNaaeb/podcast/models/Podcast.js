const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var podcastSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subscriptionType: {
      type: String,
      enum: ["Free", "VIP", "PREMIUM"],
      required: true,
      default: "Free",
    },
    verified: { type: Boolean, required: true, default: false },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast", podcastSchema);
