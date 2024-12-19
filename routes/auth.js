const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');



const  JWT_SECRET = "halumshadat";



//Root checking
// router.get('/', (req, res) => {
//     res.send('Welcome Backend !');
//     console.log(req.body);
// })



//Router 1: create a SignUp using: "/api/auth"


router.post('/signup',[

        body('name')
            .isString().withMessage('Name must be a string')
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('email')
            .isEmail().withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 6 }) // Minimum 6 characters
            .withMessage('Password must be at least 6 characters long')



], async (req, res) => {

    let success = false;


    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }


    //Check weather the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ errors: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);



    //create a new user input and save database
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashpassword
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = await jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});

    }
    catch (err) {
            console.error(err);
            res.status(500).json({ errors: "Internal Server Error" });
    }


    })



//Router 2: User Login
router.post('/login',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password', "password cannot be blank").exists(),

], async (req, res) => {


    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return error messages if validation fails
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({email});
        if (!user) {
            success = false;
            return res.status(400).json({success, errors: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });

        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = await jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});



    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: "Internal Server Error" });
    }

});


//Route 3: Get loggedin User Details using POST "/api/auth/getuser"
router.post("/getuser", fetchuser ,async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send({user})

    } catch (err) {
        console.error(err);
        res.status(500).json({errors: "Internal Server Error"});
    }

});



module.exports = router;