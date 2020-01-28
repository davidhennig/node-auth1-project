const express = require("express");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const apiRouter = require("./api-router.js");
const configureMiddleware = require("./configure-middleware.js");
const dbConnection = require("../database/dbConfig");

const server = express();

const sessionConfig = {
  name: "oreo",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
  cookie: {
    maxAge: 1000 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60000
  }),
  loggedIn: false,
  userId: ""
};

server.use(session(sessionConfig));

configureMiddleware(server);

server.use("/api", apiRouter);

module.exports = server;
