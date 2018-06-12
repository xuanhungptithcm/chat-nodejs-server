var router = require('express').Router();
var userController = require('./../controller/user.controller');
var auth = require('../middle-ware/auth');

module.exports = function () {
    router.get('/', auth.auth(), userController.getAllUser);
    router.get('/:email', auth.auth(), userController.getUserByEmail);
    router.get('/:id', auth.auth(), userController.getUserById);
    router.put('/:id', userController.updateUser);
    router.post('/searchUser', userController.searchUserArray);
    router.delete('/:id', auth.auth(), userController.deleteUser);
    router.put('/uploadfile/:id', auth.auth(), userController.uploadAvatar);
    router.post('/resgister', userController.createUser);
    return router;
}