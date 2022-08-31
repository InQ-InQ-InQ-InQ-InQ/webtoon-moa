const express = require('express');
const bodyParser =require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const { route } = require('.');
const router = express.Router();
const db = require('../config/db');
const auth = require('./common/auth');
const nodemailer = require('nodemailer');
var crypto = require('crypto');
const { checkSignUp } = require('./common/auth');
require('dotenv').config();

const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=webtoon-moa`;

router.get('/sign-up', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  const exception = request.query.exception;
  response.render('signup', { exception: exception });
});

router.post('/sign-up', function(request, response){
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  const { memberName, signupId, signupPw, signupPwCheck, signupEmail } = request.body;
  if(signupPw !== signupPwCheck){
    response.redirect('/users/sign-up?exception=비밀번호가 서로 일치하지 않습니다.');
    return;
  }

  const sql = 'SELECT * FROM user WHERE identifier=? or email=?';
  db.query(sql, [signupId, signupEmail], function(error, user){
      if (user[0] === undefined) {
        console.log('회원가입 성공')
        db.query('insert into user(username, identifier, password, email) value(?,?,?,?)', [
          memberName, signupId, signupPw, signupEmail
        ]);
        response.redirect('/');
      }
      else {
           console.log('아이디 또는 이메일이 중복됩니다.');
           response.redirect('/users/sign-up?exception=아이디 또는 이메일이 중복됩니다.');
           return;
      }
  });
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

router.get('/find-id', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const exception = request.query.exception;
  response.render('findid', { exception: exception });
});

router.post('/find-id',async (request, response)=>{
    //인증받은 사용자인지 체크
    if(auth.isLogin(request, response)){
      response.redirect('/');
      return;
    }

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
      const token = crypto.randomBytes(20).toString('hex'); // 3. token 생성(인증코드)
      const data = {
        //인증코드 테이블에 넣을 데이터 정리
        id: token,
        email: findEmail,
        // ttl: 300, // ttl 값 설정 (5분)
      };
      db.query('INSERT INTO emailauth (id,email) VALUES (?,?)',[data.id,data.email],
      function(error,results){
        if(error) console.log(error);
      })
      const transporter = nodemailer.createTransport({
          service:'gmail',
          port: 465,
          secure: true,
          auth:{
            user: 'rnlduadns@gmail.com',
            pass: 'jhajsizzazqlpiud',
          },
      });
  
      const emailOptions = {
        from: 'rnlduadns@gmail.com',
        to: findEmail,
        subject: ' 웹툰모아 인증번호설정.',
        html: '인증번호: '
             + `${token}`,
      };
      transporter.sendMail(emailOptions,response);
  
      response.redirect('/users/confirm-id');
  
    } 
    });
});

router.get('/confirm-id', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  
  const exception = request.query.exception;
  const findId = request.body.toString();
  var context = "";
  response.render('confirmid', { exception: exception ,findId : findId, context:context});
});


router.post('/confirm-id', urlencodedParser, function(request,response){
  const exception = request.query.exception;
  var context = "";
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const { idToken } = request.body;
  const sql = 'SELECT * FROM user u LEFT JOIN emailauth e on u.email = e.email WHERE e.id = ?';
  db.query(sql, idToken, function(error, user){
   if(error) {
     console.log(`DB error=${error}`);
     return;
   }
   if(user[0] === undefined){
    console.log(`incorrect idToken`);
    response.redirect(`/users/confirm-id?exception=인증번호를 틀렸습니다.`);
    return;
   }
   else{

    console.log(user);
    findId= user[0].identifier;
    context = findId.toString();
    response.render('confirmid',{exception: exception ,findId : findId, context: context});
    response.end;
   }
 });
});


router.get('/find-pw', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const exception = request.query.exception;
  response.render('findpw', { exception: exception });
});

router.post('/find-pw', async (request, response)=> {
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  
  const { pwEmail,pwId } = request.body;
  const sql = `SELECT * FROM user WHERE identifier=?`; 
  db.query(sql, pwId, function(error, user){
  if(error) {
      console.log(`DB error=${error}`);
      return;
    }
  if(user[0] === undefined){
    console.log(`아이디가 없습니다`);
    response.redirect(`/users/find-pw?exception=존재하지 않는 계정입니다.`);
    return;
  }
  else if(pwEmail !== user[0].email){
    console.log('Incorrect email');
    response.redirect('/users/find-pw?exception=아이디와 이메일주소가 일치하지 않습니다.');
    return;
  }
  else{
    const token = crypto.randomBytes(20).toString('hex'); // 3. token 생성(인증코드)
    const data = {
      //인증코드 테이블에 넣을 데이터 정리
      id: token,
      email: pwEmail,
      // ttl: 300, // ttl 값 설정 (5분)
    };
    db.query('INSERT INTO emailauth (id,email) VALUES (?,?)',[data.id,data.email],
    function(error,results){
      if(error) console.log(error);
    })
    const transporter = nodemailer.createTransport({
        service:'gmail',
        port: 465,
        secure: true,
        auth:{
          user: 'rnlduadns@gmail.com',
          pass: 'jhajsizzazqlpiud',
        },
    });

    const emailOptions = {
      from: 'rnlduadns@gmail.com',
      to: pwEmail,
      subject: ' 웹툰모아 비밀번호입니다.',
      html: '사용자 비밀번호: '
           + `${user[0].password}`,
    };
    transporter.sendMail(emailOptions,response);

    response.redirect('/users/confirm-pw');

  } 
  });
});



router.get('/confirm-pw', (request, response)=>{
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }
  
  const exception = request.query.exception;
  const findPw = request.body.toString();
  var context = "";
  response.render('confirmpw', { exception: exception ,findPw : findPw, context:context});
});


router.post('/confirm-pw', urlencodedParser, function(request,response){
  const exception = request.query.exception;
  var context = "";
  //인증받은 사용자인지 체크
  if(auth.isLogin(request, response)){
    response.redirect('/');
    return;
  }

  const { pwToken } = request.body;
  const sql = 'SELECT * FROM user u LEFT JOIN emailauth e on u.email = e.email WHERE e.id = ?';
  db.query(sql, pwToken, function(error, user){
   if(error) {
     console.log(`DB error=${error}`);
     return;
   }
   if(user[0] === undefined){
    console.log(`incorrect pwToken`);
    response.redirect(`/users/confirm-pw?exception=인증번호를 틀렸습니다.`);
    return;
   }
   else{

    console.log(user);
    findPw= user[0].password;
    context = findPw.toString();
    response.render('confirmpw',{exception: exception ,findPw : findPw, context: context});
    response.redirect('/users/sign-up');
   }
 });
});

module.exports = router;
