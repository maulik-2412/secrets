const express=require('express');
const passport=require('passport')

const router=express.Router();

router.get('/auth/google',(req,res)=>{
    passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email' ] })
});

router.get( '/auth/google/posts',
    passport.authenticate( 'google', {
        successRedirect: '/posts',
        failureRedirect: '/login'
}));

module.exports=router;