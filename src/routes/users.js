const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('./common/auth');

router.get('/sign-up', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  
  res.render('signup');
});

router.post('/sign-up', function(request, response){
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const { id, identifier, password, username, email } = request.body;

  const sql = `SELECT * FROM user WHERE id=?`; 
  db.query(sql, [id], function(error, users){
      if (users.length == 0) {
          console.log('회원가입 성공')
          db.query('insert into user(identifier, password, username, email) value(?,?,?,?)', [
              identifier, password, username,  email
          ]);
          response.redirect('/')
      } else {
           console.log('회원가입 실패');
           response.send('<script>alert("회원가입 실패");</script>')
           response.redirect('/');
      }
  })
});

router.get('/sign-in', function(request, response) {
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const exception = request.query.exception;
  response.render('signin', { exception: exception });
});

router.post('/sign-in', function(request, response){
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const { loginId, loginPw } = request.body;

  const sql = 'SELECT * FROM user WHERE identifier = ?';
  db.query(sql, loginId, function(error, user){
    if(error) {
      console.log(`DB error=${error}`);
      return;
    }
    
    if(user[0] === undefined){
      console.log(`Identifier not found`);
      response.redirect(`/users/sign-in?exception=존재하지 않는 계정입니다.`);
      return;
    }

    if(loginPw !== user[0].password){
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
    if(!auth.isLogin(request, response)){
      response.redirect('/users/sign-in');
      return;
    }

    response.redirect('/');
  })
});

module.exports = router;
