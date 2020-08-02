const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const User = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    loginLog:[{
        type: Date,
        required: true
    }],
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    privileges:{
        type: String,
        default: "dentist",
        required:true
    },
    gender:{
        type:String,
        required: true
    },
    birthday:{
        type:Date,
        required:true
    },
    numberphone:{
        type: String
    }
});




module.exports =  mongoose.model('users', User);