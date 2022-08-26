const express = require('express');
const router = express.Router();

router.get('/list/:day', function(request, response, next){
    const user = request.session.user;
    response.render('main', { user: user });
});

 router.get('/list/:day/:platform', function(request, response, next) {
    const user = request.session.user;
    response.render('main', { user: user });
});

router.get('/search', function(request, response, next){
    const user = request.session.user;
    response.render('main', { user: user });
});

module.exports = router;