var config = require('./../config').mongodb;
var mongoose = require('mongoose');
var message = require('./../utils/message');
mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://angular-nodejs:Test_pw1@ds016068.mlab.com:16068/angular-nodejs',{useMongoClient:true});
var connect_mongo = mongoose.connect('mongodb://angular-nodejs:Test_pw1@ds016068.mlab.com:16068/angular-nodejs', function (err, db) {
    if(err){
        console.log(err);
    }else{
        console.log(message.SUCCESS_MESSAGE.MONGOOES.CONNECT_SUCCESS);
    }
});
module.exports = connect_mongo;