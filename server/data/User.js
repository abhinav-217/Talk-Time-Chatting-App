const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username:{type:String,unique:false},
    email:{type:String,unique:true},
    password:String,
    phone:{type:String,unique:true},
    contactList:[]
},{timestamps:true});

const UserSchemaModel = mongoose.model('User',UserSchema);
module.exports = UserSchemaModel;
