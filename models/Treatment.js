const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const Treatment = new Schema({
    typeoftreatmentId:{
        type: Schema.Types.ObjectId,
        ref: 'typeoftreatments',
        required: true
    },
    patientId:{
        type: Schema.Types.ObjectId,
        ref: 'patients',
        required: true
    },
    appointmentId:[{
        type: Schema.Types.ObjectId,
        ref: 'appointments'
    }],
    price:{
        type: Number,
        required: true
    },
    start:{
        type: Date,
        required: true
    },
    end:{
        type: Date
    }
});

module.exports =  mongoose.model('treatments', Treatment);