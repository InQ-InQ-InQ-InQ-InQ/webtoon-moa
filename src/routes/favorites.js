const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('./common/auth');

// 사용자 즐겨찾기 보기 API
router.get('/', function(request, response){
  const user = auth.getLoginUser(request, response);
  if(user === undefined){
    alert("로그인이 필요한 서비스입니다.");
    return;
  }

  const sql = `SELECT * FROM webtoon as w INNER JOIN favorites as f on w.id = f.webtoon_id WHERE f.user_id = ?`;
  db.query(sql, user.id, function(error, favorites){
      if(error) {
          console.log(`DB error=${error}`);
          return;
      }
      response.send(favorites);
  });
})

//즐겨찾기 추가하기 API
router.post('/', function(request, response){
    const user = auth.getLoginUser(request, response);
    if(user === undefined){
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    const webtoon_id = request.body.webtoon_id;
    const is_favorite = request.body.is_favorite;
    console.log(webtoon_id);
    let sql = '';
    if(is_favorite){
      sql += `INSERT INTO favorites (user_id, webtoon_id) VALUES (?, ?)`;
    } else {
      sql += `DELETE FROM favorites WHERE user_id = ? AND webtoon_id = ?`;
    }

    db.query(sql, [user.id, webtoon_id], function(error, result){
        if(error) {
            console.log(`DB error=${error}`);
            return;
        }
        response.send(result);
    });
});

module.exports = router;