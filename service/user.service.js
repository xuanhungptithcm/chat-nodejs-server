var User = require('./../models/user.model');
var crypto = require('./../utils/crypto');
var message = require('./../utils/message');
var uuid = require('uuid');
var jwt = require('./../utils/jwt');
var path = require('path');
var config = require('./../utils/message');
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var configServer = require('../config');
var fs = require('fs');
module.exports = {
    getAllUser: getAllUser,
    getUserById: getUserById,
    updateUser: updateUser,
    deleteUser: deleteUser,
    uploadFile: uploadFile,
    getUserByEmail: getUserByEmail,
    createUser: createUser,
    searchUserArray: searchUserArray
}

function searchUserArray(request) {
    var textSearch = request.textSearch;
    return new Promise((resolve, reject) => {
        try {
            User.find({ fullname: { $regex: textSearch } }).exec((err, userModelArray) => {
                if (err) {
                    reject(message.ERROR_MESSAGE.USER.NOT_FOUND_USER);
                } else if (userModelArray) {
                    resolve(userModelArray);
                } else {
                    reject(message.STATUS_CODE.NOT_FOUND);
                }
            });
        } catch (error) {
            reject(message.STATUS_CODE.NOT_FOUND);
        }
    });
}

function uploadFile(request) {

    var id = request.id;
    var base64Data = request.base64Data;
    var typeImg = request.typeImg;
    var type = request.type;
    var nameImg = uuid.v4();
    return new Promise((resolve, reject) => {

        try {
            User.findById({ _id: id })
                .exec((err, userModel) => {
                    if (err) reject({
                        message: config.CAN_NOT_UPLOAD
                    })
                    if (!userModel) {
                        reject({
                            message: config.CAN_NOT_UPLOAD
                        });
                    } else {
                        let url = '';
                        if (type === '.png' || type === '.jpg' || type === '.jpeg' || type === '.JPG' || type === '.x-icon') {
                            var binaryData = new Buffer(base64Data, 'base64').toString('binary');//Read File You Send To
                            fs.writeFile('public/avatar/' + nameImg + type, binaryData, "binary", function (err) {
                                if (err) {
                                    console.log(err);
                                } else{
                                    console.log('The file has been saved!');
                                }

                                var port = process.env.PORT || configServer.PORT;
                                url = configServer.HTTP + configServer.DOMAIN + ':' + port + '/static/' + nameImg + type;
                                if (userModel.image != '' || userModel.image != undefined) {
                                    var urlNeedCut = userModel.image.slice(48);
                                    console.log('delete image:=', urlNeedCut);

                                    fs.unlink('public/avatar/' + urlNeedCut, function (err) {

                                    });
                                }
                                console.log('url:=', url);

                                userModel.image = url || userModel.image;
                                userModel.save();
                                resolve(url);
                            });
                        } else if (type === '.pdf') {
                            var binaryData = new Buffer(base64Data, 'base64').toString('binary');//Read File You Send To
                            fs.writeFile('public/pdf/' + nameImg + type, binaryData, "binary", function (err) {
                                let port = process.env.PORT || configServer.PORT;
                                url = configServer.HTTP + configServer.DOMAIN + '/static/' + nameImg + type;
                                resolve(url);
                            });
                        } else {
                            var binaryData = new Buffer(base64Data, 'base64').toString('utf8');//Read File You Send To
                            fs.writeFile('public/text/' + nameImg + type, binaryData, "utf8", function (err) {
                                var port = process.env.PORT || configServer.PORT;
                                url = configServer.HTTP + configServer.DOMAIN + '/static/' + nameImg + type;
                                resolve(url);
                            });
                        }
                    }
                });
        } catch (error) {
            reject(error);
        }
    })
}




function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: email
        }).exec(function (err, response) {
            if (err) {
                reject({
                    message: err.message
                });
            } else {
                resolve(response);
            }
        });
    })
}
function deleteUser(request) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: request.id
        }).exec(function (err, response) {
            if (err) {
                reject({
                    message: err.message
                });
            } else {
                if (!response) {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.USER.NOT_FOUND
                    })
                } else {
                    User.remove({
                        _id: request.id
                    }).exec(function (err, response) {
                        if (err) {
                            reject({
                                statusCode: message.STATUS_CODE.NOT_FOUND,
                                message: message.ERROR_MESSAGE.USER.NOT_FOUND
                            });
                        } else {
                            resolve({
                                statusCode: message.STATUS_CODE.SUCCES,
                                message: message.SUCCESS_MESSAGE.USER.DELETED
                            });
                        }
                    });
                }
            }
        });
    });
}
function updateUser(request) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: request.id
        }).exec(function (err, userModel) {
            if (err) {
                reject({
                    message: message.ERROR_MESSAGE.USER.NOT_FOUND
                });
            } else {
                if (userModel) {
                    userModel.firstname = request.firstname || userModel.firstname;
                    userModel.lastname = request.lastname || userModel.lastname;
                    userModel.email = request.email || userModel.email;
                    userModel.city = request.city || userModel.city;
                    userModel.company = request.company || userModel.company;
                    userModel.slogan = request.slogan || userModel.slogan;
                    userModel.address = request.address || userModel.address;
                    userModel.country = request.country || userModel.country;
                    userModel.password = request.password ? crypto.hashWithSalt(request.password, userModel.salt) : undefined || userModel.password;
                    userModel.save(function (err, response) {
                        if (err) {
                            reject({
                                message: message.ERROR_MESSAGE.USER.NOT_FOUND
                            })
                        } else {
                            jwt.sign(convertUserModelToUserResponse(response), function (err, token) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        token: token
                                    })
                                }
                            });
                        }
                    });
                } else {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.USER.NOT_FOUND
                    });
                }
            }
        })
    });
}
function getUserById(id) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: id
        }).exec(function (err, response) {
            if (err) {
                reject({
                    message: err.message
                });
            } else {
                if (!response) {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.NOT_FOUND
                    });
                } else {
                    resolve(response);
                }
            }
        });
    });
}
function getAllUser() {
    return new Promise((resolve, reject) => {
        User.find({}).exec(function (err, response) {
            if (err) {
                reject(err)
            } else {
                resolve(response);
            }
        })
    });
}
function createUser(request) {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: request.email
        }).exec(function (err, userModel) {
            if (err) {
                reject(err);
            } else {
                if (!userModel) {
                    var salt = crypto.genSalt();
                    var newUser = new User({
                        email: request.email,
                        firstname: request.firstname,
                        lastname: request.lastname,
                        company: request.company,
                        slogan: request.slogan,
                        address: request.address,
                        country: request.country,
                        city: request.city,
                        salt: salt,
                        fullname: request.lastname + ' ' + request.firstname,
                        password: crypto.hashWithSalt(request.password, salt),
                        image: "",
                        modifiDate: new Date(),
                        createdDate: new Date(),
                        deleted: 1
                    });

                    newUser.save(function (err, response) {
                        if (err) {
                            reject(err);
                        } else {
                            // var newWaitForYouModel = new waitForYouModel({
                            //     ownerID: response._id,
                            //     listWaitFriend: []
                            // });
                            // newWaitForYouModel.save(function (err) {
                            //     if (err) {
                            //         reject(err);
                            //     }
                            // });
                            jwt.sign(convertUserModelToUserResponse(response), function (err, token) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        token: token
                                    })
                                }
                            })
                        }
                    });
                } else {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.USER.EMAIL_EXIST
                    });
                }
            }
        });
    });
}

function convertUserModelToUserResponse(userModel) {
    var userObj = userModel.toObject();
    delete userObj.password;
    delete userObj.salt;
    delete userObj.createdDate;
    delete userObj.deleted;
    delete userObj.modifiDate;
    delete userObj.fullname;
    return userObj;
}

