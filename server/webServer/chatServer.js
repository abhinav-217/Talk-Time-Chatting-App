const { isNull } = require("lodash");
const { verifyToken } = require("../controllers/authcontroller")
const MessageModel = require("../data/MessageModel")


const checkFileType = (ext)=>{
    if(ext == 'jpg' || ext == 'jpeg' || ext == 'png')
    {
        return true;
    }
    return false;
}
const makeServer = async (wss) => {
const fs = require('fs');
    wss.on('connection', (connection, req) => {
        // console.log("Chating on");
        const cookie = req.headers.cookie;
        if (cookie !== undefined) {
            // console.log(cookie)
            const Usertoken = cookie.split(":").find(str => str.startsWith('token='));
            // console.log(Usertoken)
            if (Usertoken && Usertoken !== undefined) {
                const token = Usertoken.split("=")[1];
                if (token !== undefined) {
                    const response = verifyToken(token)
                    const { username, id, email,phone } = response;
                    connection.id = id;
                    connection.username = username;
                    connection.email = email;
                    connection.phone = phone;
                }
            }

        }
        // console.log([...wss.clients].map(c => c.username))
        let wssClients = [...wss.clients];
        // console.log(wssClients)
        wssClients.forEach(client=>{
            client.send(JSON.stringify({
                usersOnline:wssClients.map(c => ({userId:c.id,username:c.username,phone:c.phone,email:c.email})),
                status:true
            }))
        })
        connection.on("message",async (message)=>{
            message = JSON.parse(message.toString());
            let {reciever,recieverPhone,text,senderPhone,file} = message;
            let filename = null;
            let path = null;
            let fileType = false;
            let fileData = null;
            if(file)
            {
                // console.log(file.name)
                const parts = file.name.split('.');
                const ext = parts[parts.length - 1]
                fileType = checkFileType(ext);
                fileData = file.data;
            }
            if((reciever && text) || (!isNull(fileData) && fileData !== undefined) )
            {
                const messageDoc = await MessageModel.create({
                    sender:connection.id,
                    recipient:reciever,
                    text:text,
                    senderPhone:senderPhone,
                    recipientPhone:recieverPhone,
                    filePath: fileData,
                    isImage: fileType

                });
                [...wss.clients]
                .filter(c => c.id === reciever)
                .forEach(c => c.send(JSON.stringify({text,senderPhone,_id:messageDoc._id,recieverPhone,filePath: fileData ? fileData : null,isImage:fileType,createdAt:Date.now()})));
            }
        })
    })
}

module.exports = { makeServer }