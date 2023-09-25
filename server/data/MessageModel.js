const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId,ref:'User'}, 
    senderPhone: { type: String, ref: 'User' },
    recipientPhone: {type:String,ref:'User'},
    text: String,
    filePath:String,
    isImage:Boolean
},{timestamps:true})

const MessageModel = mongoose.model('MessageModel', MessageSchema);
module.exports = MessageModel;