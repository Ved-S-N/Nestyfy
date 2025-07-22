const Listing = require("../models/listing");
const axios = require("axios");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  console.log("testing flow");
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you visited does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// module.exports.createListing = async (req, res) => {

//   let url = req.file.path;
//   let filename = req.file.filename;

//   const geoData = await axios.get(
//     "https://nominatim.openstreetmap.org/search",
//     {
//       params: {
//         q: `${listing.location}, ${listing.country}`,
//         format: "json",
//         limit: 1,
//       },
//       headers: {
//         "User-Agent": "AirbnbClone/1.0", // Required by Nominatim usage policy
//       },
//     }
//   );

//   const coords = geoData.data[0]; // Use first result
//   const geometry = {
//     type: "Point",
//     coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)], // [lng, lat]
//   };

//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;

//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "New listing created!");
//   res.redirect("/listings");
// };

module.exports.createListing = async (req, res) => {
  const { listing } = req.body;

  // Get image info
  const url = req.file?.path;
  const filename = req.file?.filename;

  // Geocode the location
  const geoResponse = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: `${listing.location}, ${listing.country}`,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "AirbnbClone/1.0", // Required by Nominatim
      },
    }
  );

  if (!geoResponse.data.length) {
    req.flash("error", "Could not find coordinates for the given location.");
    return res.redirect("/listings/new");
  }

  const coords = geoResponse.data[0]; // first result
  const geometry = {
    type: "Point",
    coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)], // [lng, lat]
  };

  // Create the listing
  const newListing = new Listing({
    ...listing,
    owner: req.user._id,
    image: { url, filename },
    geometry,
  });

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exit");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id); // Use findById instead
  listing.set(req.body.listing);
  // let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  if (req.body.listing.location) {
    try {
      const geoData = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: req.body.listing.location,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "Nestyfy/1.0 (your@email.com)",
          },
        }
      );

      if (geoData.data.length > 0) {
        const lat = parseFloat(geoData.data[0].lat);
        const lon = parseFloat(geoData.data[0].lon);
        listing.geometry = {
          type: "Point",
          coordinates: [lon, lat], // GeoJSON format: [lng, lat]
        };
      } else {
        req.flash("error", "Could not find location on map");
        return res.redirect(`/listings/${id}/edit`);
      }
    } catch (err) {
      console.error("Geocoding error:", err.message);
      req.flash("error", "Error while geocoding location");
      return res.redirect(`/listings/${id}/edit`);
    }
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
