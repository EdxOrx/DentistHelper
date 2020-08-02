const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Questionnaire = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    questions:{
        type: Array,
        required: true
    }
});

module.exports =  mongoose.model('questionnaire', Questionnaire);