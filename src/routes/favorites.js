const express = require('express');
const router = express.Router();
const db = require('../config/db');

function loginCheck(request, response){
    if(!request.session.user){
        response.redirect('/');
        return;
    }
}

//즐겨찾기 추가하기 API
router.post('/', function(request, response){
    loginCheck(request, response);

    const user_id = request.session.user.id;
    const webtoon_id = request.body.webtoon_id;
    const sql = `INSERT INTO favorites (user_id, webtoon_id) VALUES (?, ?)`;
    db.query(sql, [user_id, webtoon_id], function(error, result){
        if(error) {
            console.log(`DB error=${error}`);
            return;
        }
        response.redirect('/');
    });
});

// 사용자 즐겨찾기 보기 API
router.get('/list', function(request, response){
    loginCheck(request, response);

    const user_id = request.session.user.id;

    const sql = `SELECT * FROM webtoon as w INNER JOIN favorites as f on w.id = f.webtoon_id WHERE f.user_id = ?`;
    db.query(sql, user_id, function(error, favorites){
        if(error) {
            console.log(`DB error=${error}`);
            return;
        }
        response.send(favorites);
    });
})

module.exports = router;