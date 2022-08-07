const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:platform/:day', function(request, response, next) {
    const platform_name = request.params.platform;
    const day = request.params.day;
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
});

module.exports = router;