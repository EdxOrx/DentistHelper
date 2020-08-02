const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Patient = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    district:{
        type: String,
        required: true
    },
    municipality:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    gender:{
        type: String
    },
    birthday:{
        type: String,
        require: true
    },
    maritalstatus:{
        type: String
    },
    ocuppation:{
        type: String
    },
    email:{
        type:String,
        unique:true
    },
    numberphone:{
        type: String
    },
    dateofentry:{
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('patients', Patient);