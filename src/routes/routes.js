const route = require("express").Router();
const dolarRoute = require("./dolar");

route.use("/dolar", dolarRoute);

module.exports = route;
