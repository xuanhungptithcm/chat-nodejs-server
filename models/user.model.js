const mongoose = require('mongoose');
const config = require('./../config');

var Schema = mongoose.Schema;

const userSchema = new Schema({
    salt:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date
    },
    modifiedDate:{
        type:Date
    },
    email:{
        required:true,
        type: String
    },
    password:{
        required:true,
        type:String
    },
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    company: {
        required: true,
        type: String
    },
    slogan: {
        required: true, 
        type: String
    },
    address: {
        required: true,
        type: String
    },
    country: {
        required: true,
        type: String
    },
    city: {
      required: true,
      type: String
    },
    image: {
      type: String
    },
    fullname:{
        type:String,
        require:true
    }
});
const User = mongoose.model('user',userSchema);

module.exports = User;