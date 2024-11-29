const mongoose=require('mongoose');

const postSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
});

const Posts=mongoose.model('Posts',postSchema);

module.exports=Posts;
