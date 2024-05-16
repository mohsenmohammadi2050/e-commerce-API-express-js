var express = require('express');
var router = express.Router();
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn");

/* GET home page. */
router.get('/', isAdminLoggedIn, function(req, res, next) {
  const user = req.user
  res.render('index', { title: 'Admin Panel', user: user });
});

module.exports = router;
