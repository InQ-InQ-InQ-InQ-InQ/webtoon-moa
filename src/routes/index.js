var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  const day = new Date().getDay();
  response.redirect(`/webtoons/${day}?page=0`);
});

module.exports = router;
