const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");

// Rotas da Home
route.get("/", homeController.index);

// Rotas de login
route.get("/login", loginController.index);
route.post("/login/login", loginController.login);
route.post("/login/register", loginController.register);

module.exports = route;
