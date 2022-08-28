const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  let day = new Date().getDay();
  if(day == 0){
    day = 7;
  }
  console.log(day);
  response.redirect(`/webtoon/list/${day}`);
});

module.exports = router;
