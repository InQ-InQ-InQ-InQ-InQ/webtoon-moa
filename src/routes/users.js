const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/sign-in', function(request, response, next) {
  if(request.session.user){
    response.redirect('/');
    return;
  }
  const exception = request.query.exception;
  response.render('signin', { exception: exception });
});

router.post('/sign-in', function(request, response, next){
  const identifier = request.body.loginId;
  const password = request.body.loginPw;

  const sql = 'SELECT * FROM user WHERE identifier = ?';
  db.query(sql, identifier, function(error, user){
    if(error) {
      console.log(`DB error=${error}`);
      return;
    }
    
    if(user[0] === undefined){
      console.log(`Identifier not found`);
      response.redirect(`/users/sign-in?exception=존재하지 않는 계정입니다.`);
      return;
    }

    if(password !== user[0].password){
      console.log('Incorrect password');
      response.redirect('/users/sign-in?exception=비밀번호가 일치하지 않습니다.');
      return;
    }
    
    request.session.user = {
      id: user[0].id,
      identifier: user[0].identifier,
      username: user[0].username,
      authorized: true
    };
    
    response.redirect('/');
  });
});

router.get('/sign-out', function(request, response){
  request.session.destroy((error) => {
    if(error){
      console.log(`session error=${error}`);
      throw error;
    }
    // 세션이 존재하지 않을 경우
    if(!request.session){
      console.log('Invalid session');
      response.redirect('/users/sign-in');
      return;
    }

    response.redirect('/');
  })
});

module.exports = router;
