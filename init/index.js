const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Nestyfy";

main()
  .then(() => {
    console.log("successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6873c0cb3a92cbde7c9554ce",
  }));
  try {
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  } catch (err) {
    console.error("failed", err);
  }
};

initDB();
