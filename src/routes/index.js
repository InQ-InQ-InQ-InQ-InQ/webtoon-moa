const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET home page. */
router.get('/', function(request, response, next) {
  const user = request.session.user;
  response.render('main', { user: user });
});

/**
 * 웹툰명, 작가명으로 웹툰 검색 API
 * localhost:3000/search?search={search_name}
 */
 router.get('/search', function(request, response, next){
  const user = request.session.user;
  const search_name = request.query.search;

  const sql = `SELECT * FROM webtoon WHERE title LIKE ? OR author LIKE ?`
  db.query(sql, [`%${search_name}%`, `%${search_name}%`], function(error, webtoons){
      if(error) {
          console.log(`db error=${error}`);
          throw error;
      }
      response.render('search', { user: user, webtoons: webtoons });
  })
});

module.exports = router;
