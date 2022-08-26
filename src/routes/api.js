const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 오늘 요일의 전체 웹툰보기 API
 * localhost:3000/webtoons/{day}?page={page}&sort={sortType}
 */
router.get('/list/:day', function(request, response, next){
    const day = request.params.day;
    let sort = request.query;
    if(sort.length === undefined){
        sort = 'title';
    }

    const sql = filterQueryBySortType(sort, 'WHERE week = ?'); 
    db.query(sql, [day, sort], function(error, webtoons){
        if(error) {
            console.log(`db error=${error}`);
            throw error;
        }
        response.send(webtoons);
    });
});

/**
 * 플랫폼별 웹툰 보기 API
 * localhost:3000/webtoons/{day}/{platform}?page={page}&sort={sortType}
 */
 router.get('/list/:day/:platform', function(request, response, next) {
    const { day, platform } = request.params;
    let sort = request.query;
    if(sort.length === undefined){
        sort = 'title';
    }

    const sql = filterQueryBySortType(sort, 'WHERE week = ? AND platform_name = ?');
    db.query(sql, [day, platform, sort], function(error, webtoons){
        if(error) {
            console.log(`db error=${error}`);
            throw error;
        }
        response.send(webtoons);
    });
});

/**
 * 웹툰명, 작가명으로 웹툰 검색 API
 * localhost:3000/webtoons/search?name={search_name}page={page}&sort={sortType}
 */
router.get('/search', function(request, response, next){
    let { name, sort } = request.query;
    if(sort.length === undefined){
        sort = 'title';
    }

    const sql = filterQueryBySortType(sort, 'WHERE title LIKE ? OR author LIKE ?');
    db.query(sql, [`%${name}%`, `%${name}%`, sort], function(error, webtoons){
        if(error) {
            console.log(`db error=${error}`);
            throw error;
        }
        response.send(webtoons);
    })
});

function filterQueryBySortType(sort, condition){
    let sql = '';
    if(sort === 'favorites'){
        sql += `
        SELECT w.*, COUNT(*) AS favorites
        FROM webtoon w 
        RIGHT JOIN favorites f ON w.id = f.webtoon_id
        ${condition}
        GROUP BY f.webtoon_id
        `;
    } else {
        sql += `SELECT * FROM webtoon ${condition}`;
    }
    sql += ' ORDER BY ? DESC'

    return sql;
}

module.exports = router;