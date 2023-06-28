const express = require("express");
const app = express();

const login = (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  };
  

module.exports = login