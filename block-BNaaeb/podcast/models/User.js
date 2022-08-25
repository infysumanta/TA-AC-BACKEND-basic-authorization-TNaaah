const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
var userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
    type: { type: String, enum: ["user", "admin"], require: true },
    subscription: {
      type: String,
      enum: ["Free", "VIP", "PREMIUM"],
      required: true,
      default: "Free",
    },
    uploadedPodcast: [
      {
        type: Schema.Types.ObjectId,
        ref: "Podcast",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashPassword) => {
      if (err) return next(err);
      this.password = hashPassword;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};
module.exports = mongoose.model("User", userSchema);
