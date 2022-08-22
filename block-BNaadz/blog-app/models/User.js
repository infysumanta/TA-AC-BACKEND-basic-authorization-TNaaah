const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, SALT_WORK_FACTOR, (err, hashedPassword) => {
      if (err) return next(err);
      this.password = hashedPassword;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    callback(err, isMatch);
  });
};

userSchema.methods.fullName = function () {
  if (this.firstName && this.lastName) {
    return this.firstName + " " + this.lastName;
  }
};

module.exports = mongoose.model("User", userSchema);
