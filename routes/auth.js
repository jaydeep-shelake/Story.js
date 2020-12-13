const express = require('express');
const passport = require('passport');
const authRoute = express.Router();

//Auth with Google
//get request to auth
authRoute.get('/google',passport.authenticate('google',{scope:['profile']}));

//Google auth callback
//get request /auth/google/callback
authRoute.get('/google/callback',passport.authenticate('google',{
    failureRedirect:'/'
}),(req,res)=>{
res.redirect('/dashboard')
});

//logout user
// /auth/logout

authRoute.get('/logout',(req,res)=>{
req.logout();
res.redirect('/');
});

module.exports=authRoute;