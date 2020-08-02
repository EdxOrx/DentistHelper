const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Email = new Schema({
    name:{
        type: String,
        required: true
    },
    numberphone:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    sentdate:{
        type:Date,
        required: true
    },
    text:{
        type:String
    }
});

module.exports = mongoose.model('emails', Email);