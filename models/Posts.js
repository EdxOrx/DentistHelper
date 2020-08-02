const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Post = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    keywords:{
        type: String,
        require: true
    },
    poster:{
        type: String,
        require: true
    },
    status:{
        type: String,
        required:true
    },
    visibility:{
        type: String,
        required: true
    },
    publisheddate:{
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('posts', Post);