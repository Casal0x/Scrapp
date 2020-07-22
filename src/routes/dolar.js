const route = require("express").Router();
const { getData } = require("../controller/dolar.controller");

route.get("/", getData);

module.exports = route;
