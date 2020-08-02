const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const TypeOfTreatment = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    priceChild:{
        type: Number
    },
    priceAdult:{
        type: Number
    },
    icon:{
        type: String
    }
});

module.exports =  mongoose.model('typeoftreatments', TypeOfTreatment);