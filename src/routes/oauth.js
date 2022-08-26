const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const qs = require('qs');
const db = require('../config/db');
require('dotenv').config();

class Kakao {
    constructor(code) {
        this.url = 'https://kauth.kakao.com/oauth/token';
        this.clientID = process.env.KAKAO_CLIENT_ID;
        this.clientSecret = process.env.KAKAO_SECRET_KEY;
        this.redirectUri = process.env.KAKAO_REDIRECT_URI;
        this.code = code;
        this.userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    }
}

class Naver {
    constructor(code) {
        this.url = 'https://nid.naver.com/oauth2.0/token';
        this.clientID = process.env.NAVER_CLIENT_ID;
        this.clientSecret = process.env.NAVER_SECRET_KEY;
        this.redirectUri = process.env.NAVER_REDIRECT_URI;
        this.code = code;
        this.state = 'webtoon-moa'
        this.userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
    }
}

const getAccessToken = async (options) => {
    try {
            return await fetch(options.url, {
                method: 'POST',
                headers: {
                    'content-type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                body: qs.stringify({
                    grant_type: 'authorization_code',
                    client_id: options.clientID,
                    client_secret: options.clientSecret,
                    redirect_uri: options.redirectUri,
                    code: options.code,
                    state: 'webtoon-moa'
                }),
            }).then(res => res.json());
    }catch(e) {
        console.log("error", e);
    }
};

const getUserInfo = async (url, access_token) => {
    try {
        return await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json());
    }catch(e) {
        console.log("error", e);
    }
};

const getOption = (corporation, code)=> {
    switch(corporation){
        case 'kakao':
            return new Kakao(code);
        break;
        case 'naver':
            return new Naver(code);
        break;
    }
}

router.get(`/:corporation/callback`, async (request, response) => {
    const corporation = request.params.corporation;
    const code = request.query.code;
    const options = getOption(corporation, code);
    const token = await getAccessToken(options);
    const userInfo = await getUserInfo(options.userInfoUrl, token.access_token);
    const id = (corporation === 'kakao' ? userInfo.id : userInfo.response.id);
    const identifier = `${corporation}_${id}`;
    const username = (corporation === 'kakao' ? userInfo.properties.nickname : userInfo.response.name);

    const sql = `SELECT * FROM USER WHERE identifier = ?`
    db.query(sql, identifier, function(error, findUser){
        if(error){
            console.error(`error=${error}`);
            throw error;
        }
        //이미 가입된 회원이 아니라면 강제 회원가입 진행
        if(findUser[0] === undefined){
            const insertSql = `INSERT INTO user (identifier, password, username, email) VALUES (?, ?, ?, ?)`;
            db.query(insertSql, [identifier, `${corporation}Pwd`, username, `${identifier}@${corporation}.com`], function(error, result){
                if(error){
                    console.error(`error=${error}`);
                    throw error;
                }
            });
        } 

        //세션에 저장
        request.session.user = {
            id: id,
            identifier: identifier,
            username: username,
            authorized: true
        };
        response.redirect('/');
    });
    
})

module.exports = router;