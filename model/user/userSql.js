var user = {
    getUserAuth: 'select username, level from user where user_id =?',
    doLogin: 'select * from user where username =? and password =?'
}

module.exports = user;