const express = require('express')
const router = express.Router()
const {addUserContact,getUserContact,fetchMessages,getOfflinePeople} = require("../controllers/usercontroller")


router.route("/addnumber").post(addUserContact)
router.route("/getUserContact").post(getUserContact)
router.route("/getMessages").post(fetchMessages)
router.route("/getOfflinePeople").post(getOfflinePeople)

module.exports = router;