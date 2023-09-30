const authJWT = require("./authJWT");
const verifyUser = require("./verifyUser");
const verifyLocation = require("./verifyLocation");
const verifySensor = require("./verifySensor");
const verifyClient = require("./verifyClient");
const verifyRouter = require("./verifyRouter");

module.exports = {
    authJWT,
    verifyUser,
    verifyLocation,
    verifySensor,
    verifyClient,
    verifyRouter
}