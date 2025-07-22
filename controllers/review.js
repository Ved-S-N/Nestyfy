const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview.author);

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("new review saved");
  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log("review deleted");
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
