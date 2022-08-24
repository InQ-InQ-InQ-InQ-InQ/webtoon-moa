module.exports = {
    isLogin:function(request, response){
        if(request.session.user){
            return true;
        }
        return false;
    },
    getLoginUser:function(request, response){
        return request.session.user;
    }
}