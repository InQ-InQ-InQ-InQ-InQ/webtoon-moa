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
  response.render('main', { user: user });
});

module.exports = router;