const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const findOrCreate=require('mongoose-findorcreate');
require('dotenv').config();

const userSchema=mongoose.Schema({
    username:String,
    password:String,
    googleId:String,
    secret:String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Users=mongoose.model('Users',userSchema);

module.exports=Users;