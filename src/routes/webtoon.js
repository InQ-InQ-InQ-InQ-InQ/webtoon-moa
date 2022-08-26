const express = require('express');
const router = express.Router();
const db = require('../config/db');
/**
 * 오늘 요일의 전체 웹툰보기 API
 * 홈으로 들어왔을 때, 이 라우터로 redirect
 * localhost:3000/webtoons/{day}?page={page}
 */
router.get('/:day', function(request, response, next){
    const day = request.params.day;
    const sortType = request.query.sort;
    const page = request.query.page * 10;
    const offset = 10;
    
    const sql = `SELECT * FROM webtoon WHERE week = ? ORDER BY ? DESC LIMIT ?, ?`; 
    db.query(sql, [day, sortType, page, offset], function(error, webtoons){
        if(error) {
            console.log(`db error=${error}`);
            throw error;
        }
        response.send(webtoons);
    })
})
// 회원 즐겨찾기(좋아요) 순 웹툰 보기 API localhost:3000/webtoons/{favorites}/{day}
/**
 * 플랫폼별, 조회순 웹툰 보기 API
 * localhost:3000/webtoons/{day}/{platform}?sort={sortType}&page={page}
 * 
 * +인기순과의 URL 매핑 구별을 위하여 category 추가(성유진)
 */
router.get('/:day/:category/:platform', function(request, response, next) {
    const day = request.params.day;
    const platform_name = request.params.platform;
    const sortType = request.query.sort;
    const page = request.query.page * 10;
    const offset = 10;
    const sql = `SELECT * FROM webtoon WHERE platform_name = ? AND week = ? ORDER BY ? DESC LIMIT ?, ?`;
    db.query(sql, [platform_name, day, sortType, page, offset], function(error, webtoons){
        if(error) {
            console.log(`db error=${error}`);
            throw error;
        }
        response.send(webtoons);
    })
})
/*
 *회원 즐겨찾기(좋아요) 순 웹툰 보기 API
 * localhost:3000/webtoons/{day}/favorites&page={page}
 */
router.get('/:day/:favorites', function(request, response, next){
    const day = request.params.day;
    const sortType = request.query.sort;
    const page = request.query.page * 10;
    const offset = 10;
    const favorites = 'favorite'

    const sql = 'SELECT w.*, COUNT(*) AS 좋아요수 FROM webtoon w RIGHT JOIN favorites f ON w.id = f.webtoon_id GROUP BY f.webtoon_id';
    db.query(sql,[favorites, day, page, offset], function(error, webtoons){
        if(error) {
            console.log(`db error=${error}`);
            throw error;
        }
        response.send(webtoons);
    })

});




module.exports = router;