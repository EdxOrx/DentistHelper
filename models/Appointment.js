const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Appointment = new Schema({
    treatmentId:{
        type: Schema.Types.ObjectId,
        ref: 'treatments',
        required: true
    },
    patientId:{
        type: Schema.Types.ObjectId,
        ref: 'patients',
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'appointments',
        required: true
    },
    datetime:{
        type: Date,
        required: true
    },
    comments:{
        type: String
    },
    odontogram:{
        type: String
    },
    pictures:[{
        type: String
    }]
});

module.exports =  mongoose.model('appointments', Appointment);