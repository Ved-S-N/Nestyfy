class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    console.log("bsdk");
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
