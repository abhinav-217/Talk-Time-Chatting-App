const User = require('../data/User');
const jwt = require('jsonwebtoken')
const createToken = (userId,username,email,phone) => {
    const jwtSec = process.env.JWT_SECRETKEY;
    const token = jwt.sign({ userId,username,email,phone }, jwtSec)
    // console.log("The Token is: ", token)
    return token;
}
const verifyToken = (token) => {
    // console.log("From CheckAuth:- ",token)
    if (token !== undefined) {
        if (token.length > 0) {
            const decode = jwt.verify(token, process.env.JWT_SECRETKEY);
            if (decode.userId.length > 0) {
                return {status:true,username:decode.username,email:decode.email,id:decode.userId,phone:decode.phone};
            }
        }
    }
    else
        return {status:false};
}
async function auth_register(req, res) {
    try {
        let { username, password, email,phone } = req.body;
        const isPresentEmail = await User.find({ email });
        const isPresentUserPhone = await User.find({ phone });
        if (isPresentEmail.length == 0) {
            if (isPresentUserPhone.length == 0) {
                const createdUser = await User.create({ username, email, password,phone })
                // console.log(createdUser._id);
                const token = createToken(createdUser._id,username,email,phone);
                res.cookie('token', token).status(200).json(JSON.stringify({
                    status: true,
                    message: "Account Created Succesfully"
                }))
            }
            else {
                res.status(200).json(JSON.stringify({
                    status: false,
                    message: "Phone already exist"
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
        const isPresentEmail = []; // For Future
        // const isPresentEmail = await User.find({email:searchValue})
        const isPresentUserPhone = await User.find({phone:searchValue})
        if(isPresentEmail.length>0 || isPresentUserPhone.length>0)
        {
            // console.log("User Present");
            let user_credentials = [];
            user_credentials = (isPresentEmail.length>0) ? isPresentEmail : isPresentUserPhone;
            // console.log(user_credentials)
            let userId = user_credentials[0]._id.toString();
            let userPassword = user_credentials[0].password;
            let username = user_credentials[0].username;
            let email = user_credentials[0].email;
            let phone = user_credentials[0].phone;
            // console.log(username)
            // console.log(email)
            // console.log(phone);
            // console.log(userPassword)
            // console.log(password)
            if(userPassword !== undefined && password !== undefined && password == userPassword)
            {
                // console.log("Password Matched");
                let token = createToken(userId,username,email,phone);
                res.cookie('token',token).status(200).json(JSON.stringify({
                    status: true,
                    message: "Account Exists Credentials matched"
                }));
            }
            else
            {
                res.status(200).json(JSON.stringify({
                    status: false,
                    message: "Password Is Incorrect"
                })); 
            }
        }
        else
        {
            res.status(200).json(JSON.stringify({
                status: false,
                message: "No matching username or email"
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
        // console.log(token)
        if (token === undefined) {
            res.status(403).json(JSON.stringify({
                status: false,
                message: "User Not Signed In"
            }));
            return;
        }
        let resp = verifyToken(token);
        // console.log(resp)
        if (resp.status) {
            // console.log("here")
            res.status(200).json(JSON.stringify({
                status: true,
                message: "User Verified",
                id:resp.id,
                username:resp.username,
                email:resp.email,
                phone:resp.phone
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

module.exports = { auth_register, auth_login, auth_checkAuth, verifyToken }