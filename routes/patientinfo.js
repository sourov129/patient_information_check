const express = require('express');
const router = express.Router();
const Patient = require('../models/patientinfo');
const moment = require("moment");
const {body, validationResult} = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

// router.get('/', (req, res) => {
//     res.send('Welcome Patient info !');
//     console.log(req.body);
// })
//


//Router1: Fetch All Patient Information admin only using "/api/patient/fetchpatient"

router.get("/fetchpatient", fetchuser,async (req, res) => {

    try{


        const patientsInfo = await Patient.find();

        // Check if patient exists
        if (!patientsInfo || patientsInfo.length === 0) {
            return res.status(404).json({ error: 'No patients found' });
        }

        res.json({success: true, patientsInfo});

    }
    catch(err){
        console.error(err);
        res.status(500).json({errors: "Internal Server Error"});
    }


});


//Router2: Add a patient info admin only using "/api/patient/addpatient"
router.post('/addpatient' ,fetchuser,[

    body('patientName').notEmpty().withMessage('Patient name is required'),
    body('dateOfBirth').isDate().withMessage('Invalid date of birth format').notEmpty().withMessage('Date of birth is required'),
    body('patientGender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
    body('patientMobile').matches(/^01[3-9]\d{8}$/).withMessage('Invalid mobile number').isLength({ min: 11, max: 11 }).withMessage('Mobile number must be 11 digits'),
    body('presentAddress').notEmpty().withMessage('Present address is required'),
    body('permanentAddress').notEmpty().withMessage('Permanent address is required')


],async (req, res) => {

    const { patientName, dateOfBirth, patientGender, patientMobile, presentAddress, permanentAddress } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Check weather number is exists already
    // let patientNumber = await Patient.findOne({ patientMobile: req.body.patientMobile });
    // if (patientMobile) {
    //     return res.status(400).json({ errors: "Number already exists" });
    // }


    try{
        const age = moment().diff(moment(dateOfBirth), 'years');


        const newPatient = new Patient({
            patientName,
            dateOfBirth,
            patientAge: age,
            patientGender,
            patientMobile,
            presentAddress,
            permanentAddress

        });
        const savedPatient = await newPatient.save();
        res.json({success: true, savedPatient});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ errors: "Internal Server Error" });

    }


});

//Route 3: update Patient Info For admin uisng "/api/patient/updatepatient"

router.put('/updatepatient/:id', fetchuser,
    [

        body('patientName').notEmpty().withMessage('Patient name is required'),
        body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
        body('patientGender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
        body('patientMobile').matches(/^01[3-9]\d{8}$/).withMessage('Invalid mobile number').isLength({ min: 11, max: 11 }).withMessage('Mobile number must be 11 digits'),
        body('presentAddress').notEmpty().withMessage('Present address is required'),
        body('permanentAddress').notEmpty().withMessage('Permanent address is required')


    ]
    ,async (req, res) => {
    const { patientName, dateOfBirth, patientGender, patientMobile, presentAddress, permanentAddress } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const age = moment().diff(moment(dateOfBirth), 'years');
        Object.assign(patient, { patientName, dateOfBirth, patientAge: age, patientGender, patientMobile, presentAddress, permanentAddress });
        const updatedPatient = await patient.save();
        res.json({ success: true, updatedPatient });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: "Internal Server Error" });
    }
});


//Delete Information fro admin  using "/api/patient/deletepatient"

router.delete('/deletepatient/:id',fetchuser, async (req, res) => {

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    try{
        await Patient.findByIdAndDelete(req.params.id);
        res.json({success: true, message: 'Patient deleted successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ errors: "Internal Server Error" });
    }

});


//Route4: View Patient details by user using "/api/patient/viewpatient" (No authentication required)

router.get('/viewpatient', async (req, res) => {

    try{
        const patientsInfo = await Patient.find({}, '-_id -dateOfBirth');

        // Check if patient exists
        if (!patientsInfo || patientsInfo.length === 0) {
            return res.status(404).json({ error: 'No patients found' });
        }

        res.json({success: true, patientsInfo});

    }
    catch(err){
        console.error(err);
        res.status(500).json({errors: "Internal Server Error"});
    }
})









module.exports = router;
