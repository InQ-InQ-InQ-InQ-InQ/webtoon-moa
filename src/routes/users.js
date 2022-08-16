const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/sign-in', function(request, response, next) {
  response.render('signin');
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
      response.redirect('/users/sign-in');
      return;
    }

    if(password !== user[0].password){
      console.log('Incorrect password');
      response.redirect('/users/sign-in');
      return;
    }
    
    request.session.user = {
      id: user.id,
      identifier: user.identifier,
      username: user.username,
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
