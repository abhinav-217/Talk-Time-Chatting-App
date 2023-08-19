const User = require('../data/User');
const jwt = require('jsonwebtoken')
const createToken = (userId) => {
    const jwtSec = process.env.JWT_SECRETKEY;
    const token = jwt.sign({ userId: userId }, jwtSec)
    // console.log("The Token is: ", token)
    return token;
}
const verifyToken = (token) => {
    // console.log("From CheckAuth:- ",token)
    if (token !== undefined) {
        if (token.length > 0) {
            const decode = jwt.verify(token, process.env.JWT_SECRETKEY);
            if (decode.userId.length > 0) {
                return true;
            }
        }
    }
    else
        return false;
}
async function auth_register(req, res) {
    try {
        let { username, password, email } = req.body;
        const isPresentEmail = await User.find({ email });
        const isPresentUsername = await User.find({ username });
        if (isPresentEmail.length == 0) {
            if (isPresentUsername.length == 0) {
                const createdUser = await User.create({ username, email, password })
                console.log(createdUser._id);
                const token = createToken(createdUser._id);
                res.cookie('token', token).status(200).json(JSON.stringify({
                    status: true,
                    message: "Account Created Succesfully"
                }))
            }
            else {
                res.status(200).json(JSON.stringify({
                    status: false,
                    message: "Username already exist"
                }));
                return;
            }
        }
        else {
            res.status(200).json(JSON.stringify({
                status: false,
                message: "Email Already Exist Try Logging In!!!!"
            }));
            return;
        }
    } catch (error) {
        console.log("auth_register Error here dev: ", error)
        res.status(500).json(JSON.stringify({ status: false, message: "Some error has occured try after some time" }));
    }
}
async function auth_login(req, res) {
    try {
        let { searchValue, password } = req.body;
        console.log(searchValue, password);
        const isPresentEmail = await User.find({email:searchValue})
        const isPresentUsername = await User.find({username:searchValue})
        if(isPresentEmail.length>0 || isPresentUsername.length>0)
        {
            console.log("User Present");
            let user_credentials = [];
            user_credentials = (isPresentEmail.length>0) ? isPresentEmail : isPresentUsername;
            // console.log(user_credentials)
            let userId = user_credentials[0]._id.toString();
            let userPassword = user_credentials[0].password;
            // Not matching Password now add this
            console.log(user_credentials[0]._id.toString());
            let token = createToken(userId);
            res.cookie('token',token).status(200).json(JSON.stringify({
                status: true,
                message: "Account Exists"
            }));
        }
        else
        {
            res.status(200).json(JSON.stringify({
                status: false,
                message: "No Accounts exists for above credentials"
            })); 
        }
    } catch (error) {
        console.log("!!auth_login!! Error here dev: ", error)
        res.status(500).json(JSON.stringify({ status: false, message: "Some error has occured try after some time" }));
    }
}
async function auth_checkAuth(req, res) {
    try {
        let token = req.cookies.token;
        if (token === undefined) {
            res.status(403).json(JSON.stringify({
                status: false,
                message: "User Not Signed In"
            }));
            return;
        }
        let resp = verifyToken(token);
        if (resp) {
            res.status(200).json(JSON.stringify({
                status: true,
                message: "User Verified"
            }));
        }
        else {
            res.status(403).json(JSON.stringify({
                status: false,
                message: "User Not Verified"
            }));
        }
    } catch (error) {
        console.log("auth_checkAuth Error here dev: ", error)
        res.status(500).json(JSON.stringify({ status: false, message: "Some error has occured try after some time" }));
    }
}

module.exports = { auth_register, auth_login, auth_checkAuth }