var userService = require('./../service/auth.service');
module.exports = {
    login: login,
    getUserByToken: getUserByToken
}
function login(req, res) {
    try {
        var request = {
            email: req.body.email,
            password: req.body.pass
        }
    } catch (error) {
        console.log(error);
    }
    userService.login(request).then(function (token) {
        res.send(token);
    }).catch(function (err) {
        res.send(err)
    });

}
function getUserByToken(req, res) {
    var token = req.headers['x-access-token'];
    userService.getUserByToken(token).then(function (response) {
        res.send(response);
    })
        .catch(function (err) {
            res.send(err);
        });
}