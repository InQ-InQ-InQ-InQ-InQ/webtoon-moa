exports.isLogin = function(request, response){
    if(!request.session.user){
        response.redirect('/');
        return;
    }
    return request.session.user.id;
}