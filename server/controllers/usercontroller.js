const User = require('../data/User');
const MessageModel = require('../data/MessageModel')
const {verifyToken} = require("./authcontroller");
const { forEach } = require('lodash');
const numberExist=(contactList,number)=>{
    for(let i = 0;i<contactList.length;i++)
    {
        if(Number(contactList[i])===Number(number))
        {
            return true;
        }
    }
    return false;
}
async function addUserContact(req, res) {
    try {
        let number = req.body.number;
        let phone = req.body.phone
        if(number.length >0 && number.length<=10 && number.trim().length>0)
        {
            //Update user Contact number from here
            let current_user_credentials = [];
            current_user_credentials = await User.find({ phone });
            // console.log(current_user_credentials)
            if(current_user_credentials.length>0)
            {
                let prevContactList = current_user_credentials[0].contactList;
                if(prevContactList.length>0)
                {
                    if(numberExist(prevContactList,number)){
                        // console.log("Number exist");
                        res.status(200).json(JSON.stringify({
                            status:true,
                            message:"Number Already added before"
                        }))
                        return;
                    }
                    else{
                        // console.log("Number Don't Exist");
                        prevContactList.push(number);
                    }
                }
                else
                {
                    prevContactList.push(number);
                }
                const result = await User.updateOne({ phone: phone }, { $set: { contactList: prevContactList } })
                // console.log(result);
                res.status(200).json(JSON.stringify({
                    status:true,
                    message:"Number Added Successfully"
                }))
            }
            else
            {
                res.status(403).json(JSON.stringify({status:true,message:"No User Found"}))
            }
        }
    } catch (error) {
        res.status(500).json(JSON.stringify({status:true,message:"Something Went Wrong"}))
    }
}

async function getUserContact(req,res)
{
    try {
        let phone = req.body.phone;
        // console.log("Phone is:- ",phone)
        const getContact = await User.find({phone});
        // console.log(getContact[0].contactList);
        if(getContact.length>0)
        {
            let contactList = getContact[0].contactList;
            res.status(200).json(JSON.stringify({status:true,contactList}))
            return;
        }
        else
        {
            res.status(200).json(JSON.stringify({status:false}))
            return;
        }
    } catch (error) {
        res.status(500).json(JSON.stringify({
            status:false,
            message:"Something Went Wrong"
        }))
    }
}
async function fetchMessages(req,res)
{
    let {selectedUserid,selectedUserPhone} = req.body;
    let token = req.cookies.token
    let userData = verifyToken(token);
    if(userData.status)
    {
        const messages = await MessageModel.find({
            senderPhone:{$in:[userData.phone,selectedUserPhone]},
            recipientPhone:{$in:[userData.phone,selectedUserPhone]},
        })
        // console.log(messages);
        res.status(200).json(JSON.stringify({status:true,messages}))
    }
    else
    {
        res.status(403).json(JSON.stringify({
            status: false,
            message: "User Not Verified"
        }));
    }
}

async function getOfflinePeople(req,res)
{
    try {
        let {currentUserPhone,currentUserid} = req.body;
        let contactList = [];
        if(currentUserPhone !== undefined)
        {
            const currentUsersContactsList = await User.find({phone:currentUserPhone}).select('_id phone username contactList');
            // console.log(currentUserPhone)
            // console.log(currentUsersContactsList[0]) 
            const peopleList = currentUsersContactsList[0].contactList;
            // Find the username and id for the phone numbers stored in users Contactlist
            for(let i = 0;i<peopleList.length;i++)
            {
                const people = await User.find({phone:peopleList[i]}).select('_id phone username');
                contactList.push(people[0]);
            }
            // console.log(contactList);
            res.status(200).json(JSON.stringify({status:true,contactList}))
        }
        else
        {
            res.status(300).json(JSON.stringify({status:true,contactList:[]}));
        }
    } catch (error) {
        res.status(500).json(JSON.stringify({status:false}))
        return;
    }
}
module.exports = {addUserContact,getUserContact,fetchMessages,getOfflinePeople}