const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const { renderSignUp } = require("../controllers/user.js");
const { signUP } = require("../controllers/user.js");

router
  .route("/signup")
  .get(renderSignUp)
  .post(wrapAsync(userController.signUP));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.userLogin
  );

router.get("/logout", userController.logout);

module.exports = router;
