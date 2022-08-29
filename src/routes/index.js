const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  const user = request.session.user;
  response.render('main', { user: user });
});

module.exports = router;
