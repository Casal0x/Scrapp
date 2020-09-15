const route = require("express").Router();
const { getDataCached } = require("../controller/dolar.controller");

route.get("/", getDataCached);
// route.get("/2", getDataCached);

module.exports = route;
