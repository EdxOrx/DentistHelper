const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Answer = new Schema({
    patientId:{
        type: Schema.Types.ObjectId,
        ref: 'patients',
    },
    questionnaireId:{
        type: Schema.Types.ObjectId,
        ref: 'questionnaires',
    },
    answers:{
        type: Array,
        required: true
    }
});

module.exports =  mongoose.model('answers', Answer);