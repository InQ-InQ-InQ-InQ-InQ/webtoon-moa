const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('./common/auth');

/**
 * 오늘 요일의 전체 웹툰보기 API
 * localhost:3000/api/webtoons/{day}?sort={sortType}
 */
router.get('/list/:day', function(request, response, next){
    const user = auth.getLoginUser(request, response);
    const day = request.params.day;
    const sort = request.query.sort;

    const sql = filterQueryBySortType(sort, 'WHERE week = ?'); 
    db.query(sql, [day], function(error, webtoons){
        errorHandler(error);
        if(user === undefined){
            response.status(200).send({ webtoons: webtoons });
        } else {
            const favoriteSql = 'SELECT webtoon_id as favorite FROM favorites WHERE user_id = ?';
            db.query(favoriteSql, user.id, function(error, favorites){
                errorHandler(error);
                response.status(200).send({ webtoons: webtoons, favorites: favorites });
            })
        }
    });
});

/**
 * 플랫폼별 웹툰 보기 API
 * localhost:3000/api/webtoons/{day}/{platform}?sort={sortType}
 */
 router.get('/list/:day/:platform', function(request, response, next) {
    const user = auth.getLoginUser(request, response);
    const { day, platform } = request.params;
    const sort = request.query.sort;

    const sql = filterQueryBySortType(sort, 'WHERE week = ? AND platform_name = ?');
    db.query(sql, [day, platform], function(error, webtoons){
        errorHandler(error);
        if(user === undefined){
            response.status(200).send({ webtoons: webtoons });
        } else {
            const favoriteSql = 'SELECT webtoon_id as favorite FROM favorites WHERE user_id = ?';
            db.query(favoriteSql, user.id, function(error, favorites){
                errorHandler(error);
                response.status(200).send({ webtoons: webtoons, favorites: favorites });
            })
        }
    });
});

// 사용자 즐겨찾기 보기 API
router.get('/favorites', function(request, response){
    const user = auth.getLoginUser(request, response);
    if(user === undefined){
        response.status(403).send('로그인이 필요한 서비스입니다.');
        return;
    }
    const sql = `
        SELECT w.id, w.title, w.author, w.img_url, w.web_url, w.platform_name, w.genre_name, w.week, w.click_count, f.user_id
        FROM webtoon as w INNER JOIN favorites as f on w.id = f.webtoon_id WHERE f.user_id = ?
    `;
    db.query(sql, user.id, function(error, webtoons){
        errorHandler(error);
        response.status(200).send({ webtoons: webtoons, favorites: webtoons });
    });
})

//즐겨찾기 추가하기 API
router.post('/favorites', function(request, response){
    const user = auth.getLoginUser(request, response);
    if(user === undefined){
        response.status(403).send('로그인이 필요한 서비스입니다.');
        return;
    }
    const webtoon_id = request.body.webtoon_id;
    const is_favorite = request.body.is_favorite;
    let sql = '';
    if(is_favorite == 'true'){ //수정
        sql += `INSERT INTO favorites (user_id, webtoon_id) VALUES (?, ?)`;
    } else {
        sql += `DELETE FROM favorites WHERE user_id = ? AND webtoon_id = ?`;
    }

    db.query(sql, [user.id, webtoon_id], function(error, result){
        errorHandler(error);
        response.status(200).json('ok');
    });
    
});

//조회수 증가 API
router.post('/click', function(request, response){
    const webtoon_id = request.body.webtoon_id; //수정
    const sql = `UPDATE webtoon SET click_count = click_count + 1 WHERE id = ?`; //수정
    db.query(sql, webtoon_id, function(error, result){
        errorHandler(error);
        response.status(200).json('ok');
    });
});

function filterQueryBySortType(sort = 'title', condition){
    let sql = `
        SELECT * FROM webtoon w
        LEFT JOIN
        (SELECT f.webtoon_id, COUNT(webtoon_id) as favorite_count FROM favorites f GROUP BY webtoon_id) as f
        ON w.id = f.webtoon_id
        ${condition}
        `
    if(sort === undefined){
        sql += 'ORDER BY w.title DESC;';
    } else if(sort === 'click_count'){
        sql += 'ORDER BY w.click_count DESC;';
    } else if(sort === 'favorite_count'){
        sql += 'ORDER BY f.favorite_count DESC;';
    }

    return sql;
}

function errorHandler(error){
    if(error){
        console.log(`db error=${error}`);
        throw error;
    }
}

module.exports = router;