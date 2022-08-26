const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  const day = new Date().getDay();
  response.redirect(`/webtoon/list/${day}?page=0`);
});

module.exports = router;
