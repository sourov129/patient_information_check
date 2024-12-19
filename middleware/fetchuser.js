var jwt = require("jsonwebtoken");
const  JWT_SECRET = "halumshadat";

const fetchuser = (req, res, next) => {

    //Get the user from jwt token and add id to
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: 'Please authenticate using a valid token'});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    }catch (error) {
        console.log(error);
        return res.status(401).send({error: 'Please authenticate using a valid token'});
    }

}


module.exports = fetchuser;