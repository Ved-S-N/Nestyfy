const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { validate } = require("joi");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  saveRedirectUrl,
  listingOwner,
  validateListing,
} = require("../middleware.js");
const lisitngController = require("../controllers/listing.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(validateListing, wrapAsync(lisitngController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(lisitngController.createListing)
  );

//new listing
router.get(
  "/new",
  isLoggedIn,
  validateListing,
  lisitngController.renderNewForm
);

router
  .route("/:id")
  .get(wrapAsync(lisitngController.showListing))
  .put(
    isLoggedIn,
    listingOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(lisitngController.updateListing)
  )
  .delete(
    isLoggedIn,
    listingOwner,
    wrapAsync(lisitngController.destroyListing)
  );

//edit listing
router.get(
  "/:id/edit",

  isLoggedIn,
  listingOwner,
  wrapAsync(lisitngController.renderEditForm)
);

module.exports = router;
