const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const findOrCreate=require('mongoose-findorcreate');
require('dotenv').config();

const userSchema=mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['viewer', 'moderator', 'admin'],
      default: 'viewer',  
    },
    googleId: { type: String, unique: true },
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Users=mongoose.model('Users',userSchema);

module.exports=Users;