const express = require('express');
const { route } = require('.');
const router = express.Router();
const db = require('../config/db');
const auth = require('./common/auth');
const nodemailer = require('nodemailer');
var crypto = require('crypto');
require('dotenv').config();

const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=webtoon-moa`;

router.get('/sign-up', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  
  response.render('signup');
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
  response.render('signin', { exception: exception, kakaoLoginUrl: kakaoLoginUrl, naverLoginUrl: naverLoginUrl });
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

    response.redirect('/');
  })
});

router.get('/find-id', (response)=>{

  response.render('findid');
});

router.post('/find-id',function(request, response){
   const { findName, findEmail } = request.body;
   const sql = 'SELECT * FROM user WHERE username = ?';
   db.query(sql, findName, function(error, user){
    if(error) {
      console.log(`DB error=${error}`);
      return;
    }
    if(user[0] === undefined){
      console.log(`username not found`);
      response.redirect(`/users/find-id?exception=존재하지 않는 계정입니다.`);
      return;
    }
    else if(findEmail !== user[0].email){
      console.log('Incorrect email');
      response.redirect('/users/find-id?exception=유저명과 이메일주소가 일치하지 않습니다. ');
      return;
    }
    else{
      console.log('아이디는'+user[0].identifier);
      response.end;
      // response.redirect('/');
    }
  });
});

router.get('/find-pw', (response)=>{
  response.render('findpw');
});

router.post('/find-pw', async (request, response)=> {
  
  const { pwEmail } = request.body;
  
  const sql = `SELECT * FROM user WHERE email=?`; 
  db.query(sql, pwEmail, function(error, user){
  if(error) {
      console.log(`DB error=${error}`);
      return;
    }
  if(user[0] === undefined){
    console.log(`이메일이 없습니다`);
    response.redirect(`/users/find-pw?exception=존재하지 않는 계정입니다.`);
    return;
  }
  else if(pwEmail !== user[0].email){
    console.log('Incorrect email');
    response.redirect('/users/find-pw?exception=존재하지 않는 계정입니다.');
    return;
  }
  else{
    const token = crypto.randomBytes(20).toString('hex'); // 3. token 생성(인증코드)
    const data = {
      //인증코드 테이블에 넣을 데이터 정리
      id: pwEmail,
      token,
      // ttl: 300, // ttl 값 설정 (5분)
    };
    db.query('INSERT INTO emailauth (id,token) VALUES (?,?)',[data.id,data.token],
    function(error,results){
      if(error) console.log(error);
    })
    const transporter = nodemailer.createTransport({
        service:'gmail',
        port: 465,
        secure: true,
        auth:{
          user:'rnlduadns@gmail.com',
          pass:'jhajsizzazqlpiud'
        },
    });

    const emailOptions = {
      from: 'rnlduadns@gmail.com',
      to: pwEmail,
      subject: ' 웹툰모아 인증번호입니다.',
      html: '인증번호: '
           + `${token}`,
    };
    transporter.sendMail(emailOptions,response);
  } 
  });
});

router.get('/confirm-pw', (response)=>{
  response.render('confirm');
});


router.post('/confirm-pw', function(request,response){
  const { pwToken } = request.body;
  const sql = 'SELECT * FROM user as u INNER JOIN emailauth as e on u.email = e.id WHERE e.token = ?';
  db.query(sql, pwToken, function(error, user){
   if(error) {
     console.log(`DB error=${error}`);
     return;
   }
   else{
     console.log('비밀번호는'+user[0].password+'입니다.');
     response.end;
     //response.redirect('/');
    //  response.redirect('/users/teach-password');
   }
 });
});

module.exports = router;
