const express = require('express')
const router = express.Router()

const {auth_register,auth_login,auth_checkAuth} = require("../controllers/authcontroller")

router.route("/register").post(auth_register)
router.route("/login").post(auth_login)
router.route("/checkAuth").get(auth_checkAuth)
module.exports = router;