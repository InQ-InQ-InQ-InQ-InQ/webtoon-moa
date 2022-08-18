const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res, next)=>{
    console.log('회원가입')
    res.render('register.ejs');
});
router.post('/', function(request, response, next){
    console.log('회원가입시작')
    const body = request.body;
    const id = body.id;
    const identifier = body.identifier;
    const password = body.password;
    const username = body.username;
    const email = body.email;

    
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

module.exports = router;