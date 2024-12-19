const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const moment = require("moment");


const PatientSchema = new Schema({
    patientName: {
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true

    },
    patientAge:{
        type: Number,
        required: true,
    },
    patientGender:{
      type: String,
      enum: ["Male", "Female", 'Other'],
      required: true
    },
    patientMobile: {
        type: String,
        required: true,
    },
    presentAddress: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String,
        required: true
    }


});

module.exports = mongoose.model('patientinfo', PatientSchema);


